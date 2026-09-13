import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column()
  condition: string;

  @Column({ nullable: true })
  image?: string;

  @Column()
  location: string;

  @Column()
  sellerName: string;

  @Column()
  sellerEmail: string;

  @Column()
  sellerId: number;

  @CreateDateColumn()
  createdAt: Date;
}