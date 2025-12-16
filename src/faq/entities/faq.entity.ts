import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Faq {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  question: string;

  @Column({ type: 'text', nullable: true })
  answer: string;

  @Column({ type: 'boolean', default: false })
  show: boolean;

  @Column({ type: 'text', nullable: true })
  menu: string;
}
