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

    async createLog(action: string, target: string, details?: string) {
        const log = this.auditLogRepository.create({
            action,
            target,
            details,
        });
        return this.auditLogRepository.save(log);
    }

    async findAll() {
        return this.auditLogRepository.find({
            order: {
                timestamp: 'DESC',
            },
        });
    }
}
