import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Event } from 'src/events/entities/event.entity';
import { Users } from 'src/users/entities/users.entitiy';
import { DetailEvent } from './detail-event.entity';
import { EmployerBranding } from './employer-brandings.entity';

export enum DurationEvents {
    FAST = 'fast',
    FIT = 'fit',
    SLOW = 'slow',
}

@Entity('event_members')
export class EventMember {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => DetailEvent, { eager: true, cascade: true, nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'detail_event_id' })
    detail_event: DetailEvent;

    @ManyToOne(() => Users, { eager: true, cascade: true, nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @Column({ type: 'boolean', nullable: true })
    attend: boolean;

    @Column({ type: 'text', nullable: true })
    suggest: string;

    @Column({ nullable: true, length: 255 })
    evidence_path: string;

    @Column({ type: 'enum', enum: DurationEvents, nullable: true })
    duration: DurationEvents;

    @Column({ nullable: true })
    material_quality: number;

    @Column({ nullable: true })
    delivery_quality: number;

    @Column({ nullable: true })
    rating: number;

    @Column({ nullable: true })
    experience: number;

    @Column({ nullable: true, length: 255 })
    next_topic: string;

    @Column({ type: 'text', nullable: true})
    testimoni: string;

    @Column({ type: 'text', nullable: true})
    improvement: string;

    @Column({ type: 'text', nullable: true})
    favorite: string;

    @OneToOne(() => EmployerBranding, (eb) => eb.event_member, {
        nullable: true,
    })
    employer_branding: EmployerBranding;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ nullable: true })
    created_by: string;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ nullable: true })
    updated_by: string;
}
