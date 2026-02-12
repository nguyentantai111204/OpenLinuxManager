export interface AuditLog {
    id: string;
    action: string;
    target: string;
    details: string;
    performedBy: string;
    timestamp: string;
}
