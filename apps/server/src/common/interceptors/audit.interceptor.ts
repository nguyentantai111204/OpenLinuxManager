import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditLogService } from '../../modules/audit-log/audit-log.service';
import { AUDIT_KEY, AuditMetadata } from '@open-linux-manager/api';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
    private readonly logger = new Logger(AuditInterceptor.name);

    constructor(
        private reflector: Reflector,
        private auditLogService: AuditLogService,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const auditMetadata = this.reflector.getAllAndOverride<AuditMetadata>(AUDIT_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!auditMetadata) {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest();
        // Assuming request.user is populated by AuthGuard if available, otherwise default to 'system' or 'admin'
        // For now, we'll try to get it from headers or default to 'admin'
        const user = request.user?.username || 'admin';

        return next.handle().pipe(
            tap(async () => {
                try {
                    await this.auditLogService.createLog(
                        auditMetadata.action,
                        auditMetadata.target,
                        `Action performed on ${request.url}`,
                        user
                    );
                } catch (error) {
                    this.logger.error(`Failed to create audit log: ${error.message}`, error.stack);
                }
            }),
        );
    }
}
