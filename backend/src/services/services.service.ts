import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createServiceDto: CreateServiceDto,
    userId: number,
    file?: Express.Multer.File,
  ): Promise<Service> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const service = this.serviceRepository.create({
      ...createServiceDto,
      image: file
        ? `/uploads/${file.filename}`
        : undefined,
      userId,
      user,
    });

    return this.serviceRepository.save(service);
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async findAll(): Promise<Service[]> {
    return this.serviceRepository.find({
      relations: {
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async update(
    id: number,
    updateData: Partial<CreateServiceDto>,
    userId: number,
    role: string,
  ): Promise<Service> {
    const service = await this.findOne(id);

    if (service.userId !== userId && role !== 'admin') {
      throw new ForbiddenException(
        'You can only edit your own service listings',
      );
    }

    Object.assign(service, updateData);

    return this.serviceRepository.save(service);
  }

  async remove(
    id: number,
    userId: number,
    role: string,
  ): Promise<{ message: string }> {
    const service = await this.findOne(id);

    if (service.userId !== userId && role !== 'admin') {
      throw new ForbiddenException(
        'You can only delete your own service listings',
      );
    }

    await this.serviceRepository.remove(service);

    return {
      message: 'Service deleted successfully',
    };
  }
}
