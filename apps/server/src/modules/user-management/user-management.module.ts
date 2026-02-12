import { Module } from '@nestjs/common';
import { UserManagementController } from './user-management.controller';
import { UserManagementService } from './user-management.service';
import { SystemModule } from '../../system/system.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
    imports: [SystemModule, AuditLogModule],
    controllers: [UserManagementController],
    providers: [UserManagementService],
    exports: [UserManagementService],
})
export class UserManagementModule { }

