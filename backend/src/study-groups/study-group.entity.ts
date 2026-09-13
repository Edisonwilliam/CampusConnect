import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { StudyGroupMember } from './study-group-member.entity';

@Entity('study_groups')
export class StudyGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  course: string;

  @Column()
  level: string;

  @Column()
  description: string;

  @Column()
  meetingDay: string;

  @Column()
  meetingTime: string;

  @Column()
  location: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.studyGroups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(
    () => StudyGroupMember,
    (membership) => membership.studyGroup,
  )
  memberships: StudyGroupMember[];

  @CreateDateColumn()
  createdAt: Date;
}
