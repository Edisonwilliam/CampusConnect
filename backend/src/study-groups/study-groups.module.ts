import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudyGroup } from './study-group.entity';
import { StudyGroupMember } from './study-group-member.entity';
import { User } from '../users/user.entity';
import { StudyGroupsService } from './study-groups.service';
import { StudyGroupsController } from './study-groups.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudyGroup,
      StudyGroupMember,
      User,
    ]),
    AuthModule,
  ],
  controllers: [StudyGroupsController],
  providers: [StudyGroupsService],
})
export class StudyGroupsModule {}
