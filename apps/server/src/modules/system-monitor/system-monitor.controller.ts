import { Controller, Delete, Get, Param } from '@nestjs/common';
import { SystemMonitorService } from './system-monitor.service';

@Controller('system')
export class SystemMonitorController {
    constructor(private readonly systemMonitorService: SystemMonitorService) { }

    @Get('stats')
    getSystemStats() {
        return this.systemMonitorService.getSystemStats();
    }

    @Get('processes')
    getSystemProcesses() {
        return this.systemMonitorService.getSystemProcesses();
    }

    @Get('storage')
    getStorageData() {
        return this.systemMonitorService.getStorageData();
    }

    @Delete('processes/:pid')
    killProcess(@Param('pid') pid: string) {
        return this.systemMonitorService.killProcess(parseInt(pid, 10));
    }
}
