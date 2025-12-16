import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { SocialMedia } from 'src/social-media/entities/social-media.entity';
import { Users } from 'src/users/entities/users.entitiy';

@Entity('teams')
export class Teams {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, { eager: true, cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ type: 'simple-array', nullable: false })
  role: string[];

  @Column({ nullable: false, length: 4 })
  generation: string;

  @Column({ nullable: true })
  image_path: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
