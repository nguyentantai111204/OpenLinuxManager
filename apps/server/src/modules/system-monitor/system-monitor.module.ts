import { Module } from '@nestjs/common';
import { SystemMonitorController } from './system-monitor.controller';
import { SystemMonitorService } from './system-monitor.service';
import { SystemGateway } from './system.gateway';
import { SystemModule } from '../../system/system.module';

@Module({
    imports: [SystemModule],
    controllers: [SystemMonitorController],
    providers: [SystemMonitorService, SystemGateway],
    exports: [SystemMonitorService],
})
export class SystemMonitorModule { }
