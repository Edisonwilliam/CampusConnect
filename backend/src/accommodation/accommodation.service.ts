import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';

import { Accommodation } from './accommodation.entity';
import { User } from '../users/user.entity';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';

@Injectable()
export class AccommodationService {
  constructor(
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject('CLOUDINARY')
    private readonly cloudinary: any,
  ) {}

  async create(
    createAccommodationDto: CreateAccommodationDto,
    userId: number,
    file?: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    let imageUrl: string | undefined;

    if (file) {
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          {
            folder: 'campusconnect/accommodation',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        uploadStream.end(file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const accommodation = this.accommodationRepository.create({
      ...createAccommodationDto,
      image: imageUrl,
      ownerId: user.id,
      ownerName: `${user.firstName} ${user.lastName}`,
    });

    return this.accommodationRepository.save(accommodation);
  }

  async findAll() {
    return this.accommodationRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const accommodation =
      await this.accommodationRepository.findOneBy({
        id,
      });

    if (!accommodation) {
      throw new NotFoundException('Accommodation not found');
    }

    return accommodation;
  }

  async update(
    id: number,
    updateAccommodationDto: UpdateAccommodationDto,
    userId: number,
    role: string,
    file?: Express.Multer.File,
  ) {
    const accommodation = await this.findOne(id);

    if (
      role !== 'admin' &&
      accommodation.ownerId !== userId
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this listing',
      );
    }

    let imageUrl: string | undefined;

    if (file) {
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          {
            folder: 'campusconnect/accommodation',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        uploadStream.end(file.buffer);
      });

      imageUrl = result.secure_url;
    }

    Object.assign(accommodation, updateAccommodationDto);

    if (imageUrl) {
      accommodation.image = imageUrl;
    }

    return this.accommodationRepository.save(accommodation);
  }

  async remove(
    id: number,
    userId: number,
    role: string,
  ) {
    const accommodation = await this.findOne(id);

    if (
      role !== 'admin' &&
      accommodation.ownerId !== userId
    ) {
      throw new ForbiddenException(
        'You do not have permission to delete this listing',
      );
    }

    await this.accommodationRepository.delete(id);

    return {
      message: 'Accommodation deleted successfully',
    };
  }
}
