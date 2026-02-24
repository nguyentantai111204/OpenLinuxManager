import { Injectable, Logger, InternalServerErrorException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import * as path from 'path';
import { SystemStats, SystemProcess, StorageData } from './system-stats.interface';
import { LinuxParser } from './utils/linux-parser';
import { CommandRunnerService } from '../../system/services/command-runner.service';
import { PythonRunnerService } from '../../system/services/python-runner.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { SystemCollectorService } from './system-collector.service';

@Injectable()
export class SystemMonitorService {
    private readonly logger = new Logger(SystemMonitorService.name);

    constructor(
        private readonly commandRunner: CommandRunnerService,
        private readonly pythonRunner: PythonRunnerService,
        private readonly auditLogService: AuditLogService,
        @Inject(forwardRef(() => SystemCollectorService))
        private readonly systemCollector: SystemCollectorService
    ) { }


    async getSystemStats(): Promise<SystemStats> {
        try {
            const scriptPath = path.join(process.cwd(), 'apps/server/src/scripts/monitor_system.py');
            return await this.pythonRunner.runScript<SystemStats>(scriptPath);
        } catch (error) {
            this.logger.error('Error getting system stats', error);
            return {
                cpu: 0,
                ram_total: 0,
                ram_used: 0,
                ram_free: 0,
                uptime: 0,
                os_name: 'Error',
                os_version: 'N/A',
                os_pretty_name: 'System monitoring error',
                timestamp: Date.now(),
                error: (error as Error).message,
            };
        }
    }

    /**
     * Get running processes
     */
    async getSystemProcesses(): Promise<SystemProcess[]> {
        try {
            const stdout = await this.commandRunner.run('ps', ['aux', '--sort=-%cpu']);
            const processes = LinuxParser.parsePsOutput(stdout);
            return processes.slice(0, 200);
        } catch (error) {
            this.logger.error('Error getting processes', error);
            throw new InternalServerErrorException('Failed to retrieve processes');
        }
    }

    /**
     * Get storage data
     */
    async getStorageData(): Promise<StorageData> {
        try {
            const stdout = await this.commandRunner.run('df', [
                '-B1',
                '--output=source,size,used,avail,pcent,target',
                '-x', 'tmpfs',
                '-x', 'devtmpfs'
            ]);
            return LinuxParser.parseDfOutput(stdout);
        } catch (error) {
            this.logger.error('Error getting storage data', error);
            throw new InternalServerErrorException('Failed to retrieve storage data');
        }
    }


    async killProcess(pid: number): Promise<{ message: string }> {
        if (!pid || isNaN(pid)) {
            throw new BadRequestException('Invalid PID');
        }

        try {
            // Use -9 for force kill (SIGKILL)
            await this.commandRunner.run('kill', ['-9', pid.toString()]);
            await this.auditLogService.createLog('FORCE_KILL_PROCESS', pid.toString(), 'Process force killed (SIGKILL)');

            // Trigger immediate refresh
            this.systemCollector.triggerProcessRefresh().catch(err =>
                this.logger.error('Failed to trigger refresh after force kill', err)
            );

            return { message: `Process ${pid} force killed successfully` };
        } catch (error) {
            this.logger.error(`Error force killing process ${pid}`, error);
            throw new InternalServerErrorException(`Failed to force kill process ${pid}`);
        }
    }

    async terminateProcess(pid: number): Promise<{ message: string }> {
        if (!pid || isNaN(pid)) {
            throw new BadRequestException('Invalid PID');
        }

        try {
            // Use -15 for graceful termination (SIGTERM)
            await this.commandRunner.run('kill', ['-15', pid.toString()]);
            await this.auditLogService.createLog('TERMINATE_PROCESS', pid.toString(), 'Process terminated gracefully (SIGTERM)');

            // Trigger immediate refresh
            this.systemCollector.triggerProcessRefresh().catch(err =>
                this.logger.error('Failed to trigger refresh after terminate', err)
            );

            return { message: `Process ${pid} terminated successfully` };
        } catch (error) {
            this.logger.error(`Error terminating process ${pid}`, error);
            throw new InternalServerErrorException(`Failed to terminate process ${pid}`);
        }
    }

    async suspendProcess(pid: number): Promise<{ message: string }> {
        if (!pid || isNaN(pid)) {
            throw new BadRequestException('Invalid PID');
        }

        try {
            await this.commandRunner.run('kill', ['-STOP', pid.toString()]);
            await this.auditLogService.createLog('SUSPEND_PROCESS', pid.toString(), 'Process suspended');

            // Trigger immediate refresh
            this.systemCollector.triggerProcessRefresh().catch(err =>
                this.logger.error('Failed to trigger refresh after suspend', err)
            );

            return { message: `Process ${pid} suspended successfully` };
        } catch (error) {
            this.logger.error(`Error suspending process ${pid}`, error);
            throw new InternalServerErrorException(`Failed to suspend process ${pid}`);
        }
    }

    async resumeProcess(pid: number): Promise<{ message: string }> {
        if (!pid || isNaN(pid)) {
            throw new BadRequestException('Invalid PID');
        }

        try {
            await this.commandRunner.run('kill', ['-CONT', pid.toString()]);
            await this.auditLogService.createLog('RESUME_PROCESS', pid.toString(), 'Process resumed');

            // Trigger immediate refresh
            this.systemCollector.triggerProcessRefresh().catch(err =>
                this.logger.error('Failed to trigger refresh after resume', err)
            );

            return { message: `Process ${pid} resumed successfully` };
        } catch (error) {
            this.logger.error(`Error resuming process ${pid}`, error);
            throw new InternalServerErrorException(`Failed to resume process ${pid}`);
        }
    }
}

