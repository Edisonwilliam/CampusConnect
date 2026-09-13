import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

    const accommodation = this.accommodationRepository.create({
      ...createAccommodationDto,
      image: file ? `/uploads/${file.filename}` : undefined,
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

    await this.accommodationRepository.update(
      id,
      updateAccommodationDto,
    );

    return this.findOne(id);
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