import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { VersionSystems } from './version-systems.entity';

@Entity('features')
export class Features {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 20 })
  name: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @ManyToOne(() => VersionSystems, { eager: true, cascade: true })
  @JoinColumn({ name: 'version_system_id' })
  version_system: VersionSystems;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
