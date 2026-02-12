import { BaseEntity } from '../base.interface';

export interface AuditLog extends BaseEntity {
    action: string;
    target: string;
    details: string;
    performedBy: string;

}
