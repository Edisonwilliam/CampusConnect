import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Service } from '../services/service.entity';
import { StudyGroup } from '../study-groups/study-group.entity';
import { UndefinedForwardRefException } from '@nestjs/core/internal';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Service, (service) => service.user)
  services: Service[];

  @OneToMany(() => StudyGroup, (studyGroup) => studyGroup.user)
  studyGroups: StudyGroup[];

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  school: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  level: string;

  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @CreateDateColumn()
  createdAt: Date;
}