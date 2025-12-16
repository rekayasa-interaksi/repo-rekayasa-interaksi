import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Roles } from '../../roles/entities/roles.entity';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Roles, { eager: true, cascade: true })
  @JoinColumn({ name: 'role_id' })
  role: Roles;

  @Column({ unique: true, nullable: false, length: 255 })
  email: string;

  @Column({ nullable: false, length: 255 })
  password: string;

  @Column({ type: 'boolean', nullable: true, default: false})
  status: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
