import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { CommandRunnerService } from '../../system/services/command-runner.service';
import { AuditLogService } from '../audit-log/audit-log.service';

export interface SystemService {
    name: string;
    description: string;
    status: 'active' | 'inactive' | 'failed' | 'unknown';
    running: boolean;
    enabled: boolean;
}

@Injectable()
export class ServiceManagerService {
    private readonly logger = new Logger(ServiceManagerService.name);

    constructor(
        private readonly commandRunner: CommandRunnerService,
        private readonly auditLogService: AuditLogService
    ) { }

    async getServices(): Promise<SystemService[]> {
        try {
            // Using systemctl list-units to get active/failed units
            const stdout = await this.commandRunner.run('systemctl', [
                'list-units',
                '--type=service',
                '--all',
                '--no-legend',
                '--no-pager'
            ]);

            return this.parseSystemctlOutput(stdout);
        } catch (error) {
            this.logger.error('Failed to list services', error);
            throw new InternalServerErrorException('Failed to list system services');
        }
    }

    async performAction(name: string, action: 'start' | 'stop' | 'restart' | 'enable' | 'disable'): Promise<{ message: string }> {
        try {
            await this.commandRunner.run('sudo', ['systemctl', action, name]);
            await this.auditLogService.createLog(`SERVICE_${action.toUpperCase()}`, name, `Service ${name} ${action}ed`);
            return { message: `Service ${name} ${action}ed successfully` };
        } catch (error) {
            this.logger.error(`Failed to ${action} service ${name}`, error);
            throw new InternalServerErrorException(`Failed to ${action} service ${name}`);
        }
    }

    private parseSystemctlOutput(stdout: string): SystemService[] {
        const lines = stdout.trim().split('\n');
        return lines.map(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length < 5) return null;

            const name = parts[0].replace('.service', '');
            const loadStatus = parts[1]; // loaded
            const activeStatus = parts[2]; // active, inactive, failed
            const subStatus = parts[3]; // running, exited, dead
            const description = parts.slice(4).join(' ');

            return {
                name,
                description,
                status: activeStatus as any,
                running: subStatus === 'running',
                enabled: true, // We'd need another command to check if enabled reliably for all
            };
        }).filter(s => s !== null) as SystemService[];
    }
}
