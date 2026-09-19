import {
  BadRequestException,
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
    let imagePublicId: string | undefined;

    if (file) {
      try {
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = this.cloudinary.uploader.upload_stream(
            {
              folder: 'campusconnect/accommodation',
              resource_type: 'image',
            },
            (error: any, result: any) => {
              if (error) {
                reject(error);
              } else if (result) {
                resolve(result);
              } else {
                reject(new Error('Cloudinary returned no result'));
              }
            },
          );

          uploadStream.end(file.buffer);
        });

        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';

        throw new BadRequestException(
          `Image upload failed: ${errorMessage}`,
        );
      }
    }

    const accommodation = this.accommodationRepository.create({
      title: createAccommodationDto.title,
      description: createAccommodationDto.description,
      price: String(createAccommodationDto.price),
      type: createAccommodationDto.type,
      location: createAccommodationDto.location,
      contact: createAccommodationDto.contact,
      image: imageUrl,
      ...(imagePublicId ? { imagePublicId } : {}),
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
    const accommodation = await this.accommodationRepository.findOneBy({
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

    if (role !== 'admin' && accommodation.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this listing',
      );
    }

    let imageUrl: string | undefined;
    let imagePublicId: string | undefined;

    if (file) {
      try {
        if (accommodation.imagePublicId) {
          try {
            await this.cloudinary.uploader.destroy(
              accommodation.imagePublicId,
            );
          } catch (deleteError: unknown) {
            console.error(
              'Failed to delete old image:',
              deleteError,
            );
          }
        }

        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = this.cloudinary.uploader.upload_stream(
            {
              folder: 'campusconnect/accommodation',
              resource_type: 'image',
            },
            (error: any, result: any) => {
              if (error) {
                reject(error);
              } else if (result) {
                resolve(result);
              } else {
                reject(new Error('Cloudinary returned no result'));
              }
            },
          );

          uploadStream.end(file.buffer);
        });

        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';

        throw new BadRequestException(
          `Image upload failed: ${errorMessage}`,
        );
      }
    }

    Object.assign(accommodation, updateAccommodationDto);

    if (updateAccommodationDto.price !== undefined) {
      accommodation.price = String(updateAccommodationDto.price);
    }

    if (imageUrl && imagePublicId) {
      accommodation.image = imageUrl;
      accommodation.imagePublicId = imagePublicId;
    }

    return this.accommodationRepository.save(accommodation);
  }

  async remove(id: number, userId: number, role: string) {
    const accommodation = await this.findOne(id);

    if (role !== 'admin' && accommodation.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this listing',
      );
    }

    if (accommodation.imagePublicId) {
      try {
        await this.cloudinary.uploader.destroy(
          accommodation.imagePublicId,
        );
      } catch (error: unknown) {
        console.error(
          'Failed to delete image from Cloudinary:',
          error,
        );
      }
    }

    await this.accommodationRepository.delete(id);

    return {
      message: 'Accommodation deleted successfully',
    };
  }
}
