import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { CommandRunnerService } from '../../system/services/command-runner.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { SystemService, SystemctlUnit, SystemctlUnitFile } from './service-manager.interface';

export { SystemService };

@Injectable()
export class ServiceManagerService {
    private readonly logger = new Logger(ServiceManagerService.name);

    constructor(
        private readonly commandRunner: CommandRunnerService,
        private readonly auditLogService: AuditLogService
    ) { }

    async getServices(): Promise<SystemService[]> {
        try {
            const [unitsJson, unitFilesJson] = await Promise.all([
                this.commandRunner.run('systemctl', [
                    'list-units', '--type=service', '--all', '--no-pager', '-o', 'json',
                ]),
                this.commandRunner.run('systemctl', [
                    'list-unit-files', '--type=service', '--no-pager', '-o', 'json',
                ]),
            ]);

            const units: SystemctlUnit[] = JSON.parse(unitsJson);
            const unitFiles: SystemctlUnitFile[] = JSON.parse(unitFilesJson);

            const enablementMap = new Map<string, string>(
                unitFiles.map((f) => [f.unit_file, f.state]),
            );

            return units.map((u) => ({
                name: u.unit.replace('.service', ''),
                description: u.description || u.unit,
                status: this.mapActiveStatus(u.active),
                running: u.sub === 'running',
                enabled: enablementMap.get(u.unit) === 'enabled',
            }));
        } catch (error) {
            this.logger.error('Failed to list services', error);
            return [];
        }
    }

    async performAction(
        name: string,
        action: 'start' | 'stop' | 'restart' | 'enable' | 'disable',
    ): Promise<{ message: string }> {
        try {
            const serviceName = name.endsWith('.service') ? name : `${name}.service`;
            await this.commandRunner.run('sudo', ['systemctl', action, serviceName]);
            await this.auditLogService.createLog(
                `SERVICE_${action.toUpperCase()}`,
                name,
                `Service ${name} ${action}ed`,
            );
            return { message: `Service ${name} ${action}ed successfully` };
        } catch (error) {
            this.logger.error(`Failed to ${action} service ${name}`, error);
            throw new InternalServerErrorException(
                `Failed to ${action} service ${name}: ${(error as Error).message}`,
            );
        }
    }

    private mapActiveStatus(active: string): SystemService['status'] {
        switch (active) {
            case 'active': return 'active';
            case 'inactive': return 'inactive';
            case 'failed': return 'failed';
            default: return 'unknown';
        }
    }
}
