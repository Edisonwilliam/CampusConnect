import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('accommodations')
export class Accommodation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column()
  type: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  image?: string;

  @Column()
  contact: string;

  @Column()
  ownerId: number;

  @Column()
  ownerName: string;

  @CreateDateColumn()
  createdAt: Date;
}