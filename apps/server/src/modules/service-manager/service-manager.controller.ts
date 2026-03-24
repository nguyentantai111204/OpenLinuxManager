import { Controller, Get, Post, Param, Body, BadRequestException, Query } from '@nestjs/common';
import { ServiceManagerService } from './service-manager.service';
import { Audit } from '@open-linux-manager/api';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('services')
export class ServiceManagerController {
    constructor(private readonly serviceManager: ServiceManagerService) { }

    @Get()
    getServices(@Query() paginationDto: PaginationDto) {
        return this.serviceManager.getServices(paginationDto);
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
