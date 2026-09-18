import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service } from './service.entity';
import { User } from '../users/user.entity';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, User]),
    PassportModule,
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
