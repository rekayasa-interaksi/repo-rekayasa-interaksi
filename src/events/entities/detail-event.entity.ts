import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Event } from './event.entity';
import { StudentChapter } from '../../student-chapters/entities/student-chapters.entity';
import { Users } from '../../users/entities/users.entitiy';
import { IsString } from 'class-validator';
import { EventMember } from './event-members.entity';

@Entity('detail_event')
export class DetailEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 255 })
  title: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'time', nullable: false })
  start_time: string;

  @Column({ type: 'time', nullable: true })
  end_time: string;

  @Column({ type: 'text', nullable: true })
  recording: string;

  @ManyToOne(() => Event, { onDelete: 'CASCADE', eager: false, cascade: true, nullable: true })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @OneToMany(() => EventMember, (eventMember) => eventMember.detail_event)
  eventMembers: EventMember[];

  @Column({ nullable: true })
  client_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ nullable: true })
  updated_by: string;
}
