import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, Long } from 'typeorm';
import { Users } from 'src/users/entities/users.entitiy';

@Entity('email_verification')
export class EmailVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false, length: 100 })
  verification_token: string;

  @Column({ nullable: false })
  type: string;

  @Column({ type: 'bigint' })
  expires_at: number;

  @Column({ type: 'boolean', default: false })
  verified: boolean;
}
