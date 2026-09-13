import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { StudyGroup } from './study-group.entity';

@Entity('study_group_members')
@Unique(['userId', 'studyGroupId'])
export class StudyGroupMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  studyGroupId: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => StudyGroup, (studyGroup) => studyGroup.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studyGroupId' })
  studyGroup: StudyGroup;

  @CreateDateColumn()
  joinedAt: Date;
}