import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { AccommodationController } from './accommodation.controller';
import { AccommodationService } from './accommodation.service';
import { Accommodation } from './accommodation.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accommodation, User]),

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [AccommodationController],
  providers: [AccommodationService],
})
export class AccommodationModule {}