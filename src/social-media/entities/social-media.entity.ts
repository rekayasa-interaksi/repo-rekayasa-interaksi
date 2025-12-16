import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Users } from 'src/users/entities/users.entitiy';

@Entity('social_media')
export class SocialMedia {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true, length: 255 })
    instagram: string;

    @Column({ nullable: true, length: 255 })
    linkedin: string;

    @Column({ nullable: true, length: 255 })
    telegram: string;

    @Column({ nullable: true })
    whatsapp: string;

    @Column({ nullable: true })
    mail: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ nullable: true })
    created_by: string;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ nullable: true })
    updated_by: string;

    @OneToOne(() => Users, (user) => user.social_media, { nullable: true })
    users: Users;
}
