import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    action: string;

    @Column()
    target: string;

    @Column({ nullable: true })
    details: string;

    @Column({ default: 'admin' }) // Hardcoded for now
    performedBy: string;

    @CreateDateColumn()
    timestamp: Date;
}
