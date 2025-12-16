import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Users } from 'src/users/entities/users.entitiy';
import { StudentClub } from '../../student-clubs/entities/student-club.entity';
import { StudentChapter } from '../../student-chapters/entities/student-chapters.entity';
  
  @Entity('histories')
  export class Histories {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'date', nullable: false })
    date: Date;

    @Column({ type: 'varchar', nullable: false })
    image_path: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ nullable: true })
    created_by: string;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ nullable: true })
    updated_by: string;
  }
  