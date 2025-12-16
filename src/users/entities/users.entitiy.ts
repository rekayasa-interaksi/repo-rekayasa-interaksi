import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  BeforeUpdate,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { StudentCampus } from '../../student-campus/entities/student-campus.entity';
import { MajorCampus } from '../../major-campus/entities/major-campus.entity';
import { SocialMedia } from '../../social-media/entities/social-media.entity';
import { StudentClub } from '../../student-clubs/entities/student-club.entity';
import { ProgramAlumni } from '../../programs-alumni/entities/program-alumni.entity';
import { StudentChapter } from '../../student-chapters/entities/student-chapters.entity';
import { Domisili } from './domisili.entity';
import { EventMember } from 'src/events/entities/event-members.entity';
import { Roles } from 'src/roles/entities/roles.entity';
import { EmailVerification } from './email-verification.entity';
import { HelpCenter } from 'src/help-centers/entities/help-centers.entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  unique_number: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  regional_origin?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  gender: string;

  @Column({ nullable: true, length: 255 })
  image_profile_path: string;

  @Column({ nullable: true, length: 255 })
  image_cover_path: string;

  @ManyToOne(() => ProgramAlumni, { eager: true, cascade: true, nullable: true })
  @JoinColumn({ name: 'program_alumni_id' })
  program_alumni: ProgramAlumni;

  @ManyToOne(() => StudentClub, { eager: true, cascade: true, nullable: true })
  @JoinColumn({ name: 'student_club_id' })
  student_club: StudentClub;

  @ManyToOne(() => StudentCampus, { eager: true, cascade: true, nullable: true })
  @JoinColumn({ name: 'student_campus_id' })
  student_campus: StudentCampus;

  @ManyToOne(() => MajorCampus, { eager: true, cascade: true, nullable: true })
  @JoinColumn({ name: 'major_campus_id' })
  major_campus: MajorCampus;

  @ManyToOne(() => Domisili, { eager: true, cascade: true, nullable: true })
  @JoinColumn({ name: 'domisili_id' })
  domisili: Domisili;

  @OneToOne(() => SocialMedia, { eager: true, cascade: true, nullable: true })
  @JoinColumn({ name: 'social_media_id' })
  social_media: SocialMedia;

  @ManyToOne(() => StudentChapter, { eager: true, cascade: true, nullable: true })
  @JoinColumn({ name: 'student_chapter_id' })
  student_chapter: StudentChapter;

  @OneToMany(() => EventMember, (eventMember) => eventMember.user)
  event_members: EventMember[];

  @Column({ nullable: true, length: 4 })
  generation: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_validate: boolean;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Roles, { eager: true, cascade: true, nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Roles;

  // @BeforeInsert()
  // @BeforeUpdate()
  // async hashPassword() {
  //   if (this.password) {
  //     this.password = await bcrypt.hash(this.password, 12);
  //   }
  // }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
