import { Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import * as path from 'path';
import { SystemStats, SystemProcess, StorageData } from './system-stats.interface';
import { LinuxParser } from './utils/linux-parser';
import { CommandRunnerService } from '../../system/services/command-runner.service';
import { PythonRunnerService } from '../../system/services/python-runner.service';

@Injectable()
export class SystemMonitorService {
    private readonly logger = new Logger(SystemMonitorService.name);

    constructor(
        private readonly commandRunner: CommandRunnerService,
        private readonly pythonRunner: PythonRunnerService
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
            return processes.slice(0, 50);
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
            await this.commandRunner.run('kill', ['-9', pid.toString()]);
            return { message: `Process ${pid} killed successfully` };
        } catch (error) {
            this.logger.error(`Error killing process ${pid}`, error);
            throw new InternalServerErrorException(`Failed to kill process ${pid}`);
        }
    }
}

