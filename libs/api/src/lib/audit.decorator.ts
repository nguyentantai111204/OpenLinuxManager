import { SetMetadata } from '@nestjs/common';

export const AUDIT_KEY = 'audit';

export interface AuditMetadata {
    action: string;
    target: string;
}

export const Audit = (action: string, target: string) => SetMetadata(AUDIT_KEY, { action, target });
