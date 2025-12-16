import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Users } from 'src/users/entities/users.entitiy';
import { StudentClub } from '../../student-clubs/entities/student-club.entity';
import { StudentChapter } from '../../student-chapters/entities/student-chapters.entity';

@Entity('organizational_structures')
export class OrganizationalStructure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, length: 255 })
  image_path: string;

  @OneToOne(() => StudentClub, { eager: true, cascade: true, nullable: true })
  @JoinColumn({ name: 'student_club_id' })
  student_club: StudentClub;

  @OneToOne(() => StudentChapter, { eager: true, cascade: true, nullable: true })
  @JoinColumn({ name: 'student_chapter_id' })
  student_chapter: StudentChapter;

  @ManyToOne(() => Users, { eager: true, cascade: true, nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ nullable: true, length: 255 })
  generation: string;

  @Column({ type: 'enum', enum: ['digistar_club', 'student_club', 'campus_chapter'] })
  type: 'digistar_club' | 'student_club' | 'campus_chapter';

  @Column()
  position: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ nullable: true })
  updated_by: string;
}
  