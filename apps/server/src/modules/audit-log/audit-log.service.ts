import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

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

    async findAll(page = 1, limit = 10) {
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
