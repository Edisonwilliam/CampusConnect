import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Request,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException(
        'Only admins can view all users',
      );
    }

    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = Number(id);

    if (req.user.role !== 'admin' && req.user.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this user',
      );
    }

    return this.usersService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    const userId = Number(id);

    if (req.user.role !== 'admin' && req.user.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this user',
      );
    }

    return this.usersService.update(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException(
        'Only admins can delete users',
      );
    }

    return this.usersService.remove(Number(id));
  }
}