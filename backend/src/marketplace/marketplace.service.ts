import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from './listing.entity';
import { User } from '../users/user.entity';
import { CreateListingDto } from './dto/create-listing.dto';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

   async create(
  createListingDto: CreateListingDto,
  userId: number,
  file?: Express.Multer.File,
) {
  const user = await this.userRepository.findOneBy({
    id: userId,
  });

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  const listing = this.listingRepository.create({
    ...createListingDto,
    image: file ? `/uploads/${file.filename}` : undefined,
    sellerId: user.id,
    sellerName: `${user.firstName} ${user.lastName}`,
    sellerEmail: user.email,
  });

  return this.listingRepository.save(listing);
}

  async findAll() {
    return this.listingRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const listing = await this.listingRepository.findOneBy({
      id,
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return listing;
  }

  async update(
  id: number,
  updateListingDto: CreateListingDto,
  userId: number,
  role: string,
) {
  const listing = await this.findOne(id);

  if (role !== 'admin' && listing.sellerId !== userId) {
    throw new ForbiddenException(
      'You do not have permission to edit this listing',
    );
  }

  await this.listingRepository.update(id, updateListingDto);

  return this.findOne(id);
}

  async remove(
  id: number,
  userId: number,
  role: string,
) {
  const listing = await this.findOne(id);

  if (role !== 'admin' && listing.sellerId !== userId) {
    throw new ForbiddenException(
      'You do not have permission to delete this listing',
    );
  }

  await this.listingRepository.delete(id);

  return {
    message: 'Listing deleted successfully',
  };
}
}