import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Users } from 'src/users/entities/users.entitiy';
import { Event } from 'src/events/entities/event.entity';
import { EventOrganizations } from 'src/events/entities/event-organization.entity';

@Entity('student_clubs')
export class StudentClub {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 255 })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'text', nullable: false })
  image_path: string;

  @Column({ type: 'text', nullable: false })
  logo_path: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ nullable: true })
  updated_by: string;

  @OneToMany(() => Users, (user) => user.student_club, { nullable: true })
  users: Users[];

  @OneToMany(() => EventOrganizations, (event) => event.student_club, { nullable: true })
  events: EventOrganizations[];
}
