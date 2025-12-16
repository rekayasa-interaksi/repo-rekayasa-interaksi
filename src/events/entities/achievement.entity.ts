import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DetailEvent } from './detail-event.entity';
import { Users } from '../../users/entities/users.entitiy';

@Entity('achievement')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 255 })
  category: string;

  @Column({ type: 'int', nullable: false })
  sequence: number;

  @Column({ type: 'int', nullable: true })
  point: number;

  @ManyToOne(() => DetailEvent, { eager: true, cascade: true, nullable: true })
  @JoinColumn({ name: 'detail_event_id' })
  detail_event: DetailEvent;

  @ManyToOne(() => Users, { eager: true, cascade: true, nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ nullable: true })
  updated_by: string;
}
