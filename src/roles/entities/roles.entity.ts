import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Admin } from 'src/admins/entities/admin.entity';
import { Users } from 'src/users/entities/users.entitiy';

@Entity('roles')
export class Roles {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, length: 255, unique: true })
    name: string;

    @Column({ nullable: true })
    type: string;

    @OneToMany(() => Admin, (admin) => admin.role, { nullable: true })
    admins: Admin[];

    @OneToMany(() => Users, (user) => user.role, { nullable: true })
    users: Users[];
}