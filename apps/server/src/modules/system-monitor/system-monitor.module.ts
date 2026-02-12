import { Module } from '@nestjs/common';
import { SystemMonitorController } from './system-monitor.controller';
import { SystemMonitorService } from './system-monitor.service';
import { SystemGateway } from './system.gateway';
import { SystemModule } from '../../system/system.module';

import { SystemCollectorService } from './system-collector.service';

@Module({
    imports: [SystemModule],
    controllers: [SystemMonitorController],
    providers: [SystemMonitorService, SystemGateway, SystemCollectorService],
    exports: [SystemMonitorService],
})
export class SystemMonitorModule { }
