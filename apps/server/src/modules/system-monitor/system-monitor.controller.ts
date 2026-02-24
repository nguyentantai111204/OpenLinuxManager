import { Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { Audit } from '@open-linux-manager/api';
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
    @Audit('TERMINATE_PROCESS', 'System Monitor')
    terminateProcess(@Param('pid') pid: string) {
        return this.systemMonitorService.terminateProcess(parseInt(pid, 10));
    }

    @Delete('processes/:pid/force')
    @Audit('FORCE_KILL_PROCESS', 'System Monitor')
    killProcess(@Param('pid') pid: string) {
        return this.systemMonitorService.killProcess(parseInt(pid, 10));
    }

    @Patch('processes/:pid/suspend')
    @Audit('SUSPEND_PROCESS', 'System Monitor')
    suspendProcess(@Param('pid') pid: string) {
        return this.systemMonitorService.suspendProcess(parseInt(pid, 10));
    }

    @Patch('processes/:pid/resume')
    @Audit('RESUME_PROCESS', 'System Monitor')
    resumeProcess(@Param('pid') pid: string) {
        return this.systemMonitorService.resumeProcess(parseInt(pid, 10));
    }
}
