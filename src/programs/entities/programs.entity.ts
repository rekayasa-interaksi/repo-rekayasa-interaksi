import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Event } from '../../events/entities/event.entity';

@Entity('programs')
export class Programs {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, length: 255 })
    name: string;

    @OneToMany(() => Event, (event) => event.program, { nullable: true })
    events: Event[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ nullable: true })
    created_by: string;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ nullable: true })
    updated_by: string;
}
