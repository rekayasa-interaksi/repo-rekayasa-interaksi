import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Users } from 'src/users/entities/users.entitiy';

@Entity('logging')
export class Logging {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  client_ip: string;

  @Column({ nullable: false, length: 150 })
  type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToOne(() => Users, { eager: false, cascade: true, nullable: true })
  @JoinColumn({name: 'user_id'})
  user: Users;
}
