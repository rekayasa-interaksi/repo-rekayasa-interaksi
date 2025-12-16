import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Users } from 'src/users/entities/users.entitiy';
import { Event } from '../../events/entities/event.entity';
import { SocialMedia } from 'src/social-media/entities/social-media.entity';
import { OrganizationalStructure } from 'src/organizational-structure/entities/organizational-structure.entity';
import { EventOrganizations } from 'src/events/entities/event-organization.entity';

@Entity('student_chapters')
export class StudentChapter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, length: 255 })
    institute: string;

    @Column({ nullable: false, length: 255 })
    address: string;

    @Column({ type: 'text', nullable: false })
    image_path: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ nullable: true })
    created_by: string;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ nullable: true })
    updated_by: string;

    @OneToMany(() => Users, (user) => user.student_chapter, { nullable: true })
    users: Users[];

    @OneToMany(() => EventOrganizations, (event) => event.student_chapter, { nullable: true })
    events: EventOrganizations[];

    @OneToOne(() => OrganizationalStructure, (structureOrg) => structureOrg.student_chapter, { nullable: true })
    leader: OrganizationalStructure;
}
