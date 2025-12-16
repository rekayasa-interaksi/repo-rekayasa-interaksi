import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';
import { StudentChapter } from '../../student-chapters/entities/student-chapters.entity';
import { StudentClub } from 'src/student-clubs/entities/student-club.entity';
import { ExternalOrganization } from 'src/external-organizations/entities/external-organization.entity';

export enum TypeActivity {
  DIGISTAR_CLUB = 'digistar_club',
  STUDENT_CLUB = 'student_club',
  CAMPUS_CHAPTER = 'campus_chapter',
}

@Entity('event_organizations')
export class EventOrganizations {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StudentChapter, { cascade: true, nullable: true })
  @JoinColumn({ name: 'student_chapter_id'})
  student_chapter: StudentChapter;

  @ManyToOne(() => StudentClub, { cascade: true, nullable: true })
  @JoinColumn({ name: 'student_club_id'})
  student_club: StudentClub;

  @ManyToOne(() => ExternalOrganization, { cascade: true, nullable: true })
  @JoinColumn({ name: 'external_organization_id'})
  external_organization: ExternalOrganization;

  @ManyToOne(() => Event, { cascade: true, nullable: true })
  @JoinColumn({ name: 'event_id'})
  event: Event;
}
