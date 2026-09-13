import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { StudyGroupsService } from './study-groups.service';
import { CreateStudyGroupDto } from './dto/create-study-group.dto';
import { UpdateStudyGroupDto } from './dto/update-study-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('study-groups')
export class StudyGroupsController {
  constructor(
    private readonly studyGroupsService: StudyGroupsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createStudyGroupDto: CreateStudyGroupDto,
    @Request() req: any,
  ) {
    return this.studyGroupsService.create(
      createStudyGroupDto,
      req.user.userId,
    );
  }

  @Get()
  findAll() {
    return this.studyGroupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studyGroupsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  join(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.studyGroupsService.join(
      id,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/leave')
  leave(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.studyGroupsService.leave(
      id,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/membership')
  membership(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.studyGroupsService.isMember(
      id,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudyGroupDto: UpdateStudyGroupDto,
    @Request() req: any,
  ) {
    return this.studyGroupsService.update(
      id,
      updateStudyGroupDto,
      req.user.userId,
      req.user.role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.studyGroupsService.remove(
      id,
      req.user.userId,
      req.user.role,
    );
  }
}