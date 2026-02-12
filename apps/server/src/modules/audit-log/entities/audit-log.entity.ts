import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@open-linux-manager/api';

@Entity()
export class AuditLog extends BaseEntity {
    @Column()
    action: string;

    @Column()
    target: string;

    @Column({ nullable: true })
    details: string;

    @Column({ default: 'admin' }) // Hardcoded for now
    performedBy: string;
}
