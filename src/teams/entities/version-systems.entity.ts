import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('version_systems')
export class VersionSystems {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 20 })
  version: string;

  @Column({ nullable: false, length: 4 })
  generation: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
