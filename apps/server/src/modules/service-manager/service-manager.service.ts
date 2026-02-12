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
            // 1. Get active/all units with status
            const unitsJson = await this.commandRunner.run('systemctl', [
                'list-units',
                '--type=service',
                '--all',
                '--no-pager',
                '-o', 'json'
            ]);

            // 2. Get unit files to check enablement status
            const unitFilesJson = await this.commandRunner.run('systemctl', [
                'list-unit-files',
                '--type=service',
                '--no-pager',
                '-o', 'json'
            ]);

            const units = JSON.parse(unitsJson);
            const unitFiles = JSON.parse(unitFilesJson);

            // Create a map for quick enablement lookup
            const enablementMap = new Map<string, string>();
            unitFiles.forEach((file: any) => {
                enablementMap.set(file.unit_file, file.state);
            });

            return units.map((u: any) => {
                const name = u.unit.replace('.service', '');
                const enabledState = enablementMap.get(u.unit);

                return {
                    name,
                    description: u.description || name,
                    status: this.mapActiveStatus(u.active),
                    running: u.sub === 'running',
                    enabled: enabledState === 'enabled',
                };
            });
        } catch (error) {
            this.logger.error('Failed to list services', error);
            // Fallback to empty if anything fails during JSON parsing or commands
            return [];
        }
    }

    async performAction(name: string, action: 'start' | 'stop' | 'restart' | 'enable' | 'disable'): Promise<{ message: string }> {
        try {
            const serviceName = name.endsWith('.service') ? name : `${name}.service`;
            await this.commandRunner.run('sudo', ['systemctl', action, serviceName]);
            await this.auditLogService.createLog(`SERVICE_${action.toUpperCase()}`, name, `Service ${name} ${action}ed`);
            return { message: `Service ${name} ${action}ed successfully` };
        } catch (error) {
            this.logger.error(`Failed to ${action} service ${name}`, error);
            throw new InternalServerErrorException(`Failed to ${action} service ${name}: ${error.message}`);
        }
    }

    private mapActiveStatus(active: string): 'active' | 'inactive' | 'failed' | 'unknown' {
        switch (active) {
            case 'active': return 'active';
            case 'inactive': return 'inactive';
            case 'failed': return 'failed';
            default: return 'unknown';
        }
    }
}
