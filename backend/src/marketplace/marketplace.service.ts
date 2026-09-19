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
import { Inject } from '@nestjs/common';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject('CLOUDINARY')
    private readonly cloudinary: any,
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

    let imageUrl: string | undefined;

    if (file) {
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          {
            folder: 'campusconnect/marketplace',
            resource_type: 'image',
          },
           (error: any, result: any) => {
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

    const listing = this.listingRepository.create({
      ...createListingDto,
      image: imageUrl,
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