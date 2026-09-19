import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('accommodations')
export class Accommodation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 12, scale: 2 })
  price: string;

  @Column()
  type: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  imagePublicId: string;

  @Column()
  contact: string;

  @Column()
  ownerId: number;

  @Column()
  ownerName: string;

  @CreateDateColumn()
  createdAt: Date;
}

