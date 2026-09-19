import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { AccommodationModule } from './accommodation/accommodation.module';
import { ServicesModule } from './services/service.module';
import { StudyGroupsModule } from './study-groups/study-groups.module';
import { PaymentModule } from './payments/payment.module';
import { UploadModule } from '../uploads/upload.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    UsersModule,
    AuthModule,
    MarketplaceModule,
    AccommodationModule,
    ServicesModule,
    StudyGroupsModule,
    PaymentModule,
    UploadModule,
    CloudinaryModule,
  ],
})
export class AppModule {}
