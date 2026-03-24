import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';

@Injectable()
export class AuditLogService {
    constructor(
        @InjectRepository(AuditLog)
        private auditLogRepository: Repository<AuditLog>,
    ) { }

    async createLog(action: string, target: string, details?: string, performedBy = 'admin') {
        const log = this.auditLogRepository.create({
            action,
            target,
            details,
            performedBy,
        });
        return this.auditLogRepository.save(log);
    }

    async findAll(paginationDto: PaginationDto): Promise<PaginatedResponse<AuditLog>> {
        const page = Number(paginationDto.page) || 1;
        const limit = Number(paginationDto.limit) || 10;

        const [data, total] = await this.auditLogRepository.findAndCount({
            order: {
                createdAt: 'DESC',
            },
            take: limit,
            skip: (page - 1) * limit,
        });

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
