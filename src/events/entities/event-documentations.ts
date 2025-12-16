import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DetailEvent } from './detail-event.entity';

@Entity('event_documentations')
export class EventDocumentations {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  image_path: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_active: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_big: boolean;

  @ManyToOne(() => DetailEvent, { cascade: true, nullable: true })
  @JoinColumn({ name: 'detail_event_id'})
  detail_event: DetailEvent
}
