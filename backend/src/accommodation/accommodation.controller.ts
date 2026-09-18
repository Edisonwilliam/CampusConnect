import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { AccommodationService } from './accommodation.service';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('accommodation')
export class AccommodationController {
  constructor(
    private readonly accommodationService: AccommodationService,
  ) {}

  @Get()
  findAll() {
    return this.accommodationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accommodationService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),

      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new Error('Only image files are allowed'),
            false,
          );
        }

        callback(null, true);
      },

      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  create(
    @Body() createAccommodationDto: CreateAccommodationDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.accommodationService.create(
      createAccommodationDto,
      req.user.userId,
      file,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),

      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new Error('Only image files are allowed'),
            false,
          );
        }

        callback(null, true);
      },

      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateAccommodationDto: UpdateAccommodationDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.accommodationService.update(
      Number(id),
      updateAccommodationDto,
      req.user.userId,
      req.user.role,
      file,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.accommodationService.remove(
      Number(id),
      req.user.userId,
      req.user.role,
    );
  }
}
