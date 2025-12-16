import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Users } from 'src/users/entities/users.entitiy';

@Entity('programs_alumni')
export class ProgramAlumni {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, length: 255 })
    name: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ nullable: true })
    created_by: string;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ nullable: true })
    updated_by: string;

    @OneToMany(() => Users, (user) => user.program_alumni, { nullable: true })
    users: Users[];
}
