import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Event } from './event.entity';
import { StudentChapter } from '../../student-chapters/entities/student-chapters.entity';
import { Users } from '../../users/entities/users.entitiy';
import { IsString } from 'class-validator';

@Entity('event_images')
export class EventImages {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, length: 255 })
  image_path: string;

  @Column({ type: 'boolean', default: false })
  activated: boolean;

  @ManyToOne(() => Event, (event) => event.images, { nullable: true })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ nullable: true })
  updated_by: string;
}
