import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import { Users } from 'src/users/entities/users.entitiy';

@Entity('major_campuss')
export class MajorCampus {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, length: 100 })
    major: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ nullable: true })
    created_by: string;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ nullable: true })
    updated_by: string;

    @OneToMany(() => Users, (user) => user.major_campus, { nullable: true })
    users: Users[];
}
