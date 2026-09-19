import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../src/cloudinary/cloudinary.service';

@Controller('upload')
export class UploadController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validMimes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, WebP, and GIF are allowed');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(file);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}