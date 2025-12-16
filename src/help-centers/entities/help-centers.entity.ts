import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from 'src/users/entities/users.entitiy';

@Entity('help_centers')
export class HelpCenter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    question: string;

    @Column({ type: 'text', nullable: true })
    answer: string;

    @Column({ type: 'boolean', default: false })
    status: boolean;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ nullable: true })
    created_by: string;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ nullable: true })
    updated_by: string;
}
