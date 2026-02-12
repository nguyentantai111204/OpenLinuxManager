import { Controller, Get, Post, Param, Body, BadRequestException } from '@nestjs/common';
import { ServiceManagerService } from './service-manager.service';
import { Audit } from '@open-linux-manager/api';

@Controller('services')
export class ServiceManagerController {
    constructor(private readonly serviceManager: ServiceManagerService) { }

    @Get()
    getServices() {
        return this.serviceManager.getServices();
    }

    @Post(':name/action')
    @Audit('SERVICE_ACTION', 'Service Manager')
    performAction(
        @Param('name') name: string,
        @Body('action') action: 'start' | 'stop' | 'restart' | 'enable' | 'disable'
    ) {
        if (!['start', 'stop', 'restart', 'enable', 'disable'].includes(action)) {
            throw new BadRequestException('Invalid action');
        }
        return this.serviceManager.performAction(name, action);
    }
}
