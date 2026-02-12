import { Module } from '@nestjs/common';
import { ServiceManagerController } from './service-manager.controller';
import { ServiceManagerService } from './service-manager.service';
import { SystemModule } from '../../system/system.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
    imports: [SystemModule, AuditLogModule],
    controllers: [ServiceManagerController],
    providers: [ServiceManagerService],
    exports: [ServiceManagerService],
})
export class ServiceManagerModule { }
