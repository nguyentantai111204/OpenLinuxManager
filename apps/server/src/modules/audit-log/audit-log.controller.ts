import { Controller, Get, Query } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';

@Controller('audit-logs')
export class AuditLogController {
    constructor(private readonly auditLogService: AuditLogService) { }

    @Get()
    findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
        return this.auditLogService.findAll(Number(page), Number(limit));
    }
}
