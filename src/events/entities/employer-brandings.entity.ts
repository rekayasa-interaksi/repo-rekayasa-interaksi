import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { EventMember } from './event-members.entity';

@Entity('employer_brandings')
export class EmployerBranding {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => EventMember, { eager: true, cascade: true, nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'event_member_id' })
    event_member: EventMember;

    @Column({ type: 'text', nullable: true })
    recomendation_reason: string;

    @Column({ nullable: true })
    recomendation_company: number;

    @Column({ nullable: true, length: 255 })
    alteration: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ nullable: true })
    created_by: string;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ nullable: true })
    updated_by: string;
}
