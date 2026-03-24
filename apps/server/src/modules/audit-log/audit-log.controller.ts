import { Controller, Get, Query } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('audit-logs')
export class AuditLogController {
    constructor(private readonly auditLogService: AuditLogService) { }

    @Get()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.auditLogService.findAll(paginationDto);
    }
}
