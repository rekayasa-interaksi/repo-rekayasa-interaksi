import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { StudentClub } from 'src/student-clubs/entities/student-club.entity';
import { StudentChapter } from '../../student-chapters/entities/student-chapters.entity';
import { DetailEvent } from './detail-event.entity';
import { Programs } from '../../programs/entities/programs.entity';
import { EventLinks } from './event-links';
import { EventImages } from './event-images';
import { EventDocumentations } from './event-documentations';
import { EventOrganizations } from './event-organization.entity';

export enum StatusEvents {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  DONE = 'done',
  CANCEL = 'cancel',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 255 })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  place: string;

  @OneToMany(() => EventOrganizations, (eventOrg) => eventOrg.event, { nullable: true })
  event_organizations: EventOrganizations[];

  @OneToMany(() => DetailEvent, (detailEvent) => detailEvent.event, { nullable: true })
  detail_events: DetailEvent[];

  @OneToOne(() => EventLinks, (link) => link.event, { nullable: true })
  links: EventLinks;

  @OneToMany(() => EventImages, (image) => image.event, { nullable: true })
  images: EventImages[];

  @Column({ type: 'boolean', default: false })
  event_activate: boolean;

  @Column({ type: 'enum', enum: StatusEvents, nullable: true })
  status: StatusEvents;

  @Column({ type: 'text', nullable: true })
  type: string;

  @ManyToOne(() => Programs, { eager: true, cascade: true, nullable: true })
  @JoinColumn({ name: 'program_id' })
  program: Programs;

  @Column({ type: 'text', nullable: true })
  rules: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ nullable: true })
  updated_by: string;
}
