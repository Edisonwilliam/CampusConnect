import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyGroup } from './study-group.entity';
import { StudyGroupMember } from './study-group-member.entity';
import { CreateStudyGroupDto } from './dto/create-study-group.dto';
import { UpdateStudyGroupDto } from './dto/update-study-group.dto';
import { User } from '../users/user.entity';

@Injectable()
export class StudyGroupsService {
  constructor(
    @InjectRepository(StudyGroup)
    private readonly studyGroupRepository: Repository<StudyGroup>,

    @InjectRepository(StudyGroupMember)
    private readonly memberRepository: Repository<StudyGroupMember>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createStudyGroupDto: CreateStudyGroupDto,
    userId: number,
  ): Promise<StudyGroup> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const studyGroup = this.studyGroupRepository.create({
      ...createStudyGroupDto,
      userId,
      user,
    });

    const savedGroup = await this.studyGroupRepository.save(studyGroup);

    await this.memberRepository.save({
      userId,
      studyGroupId: savedGroup.id,
    });

    return this.findOne(savedGroup.id);
  }

  async findAll(): Promise<any[]> {
    const groups = await this.studyGroupRepository.find({
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return Promise.all(
      groups.map(async (group) => {
        const members = await this.memberRepository.count({
          where: {
            studyGroupId: group.id,
          },
        });

        return {
          ...group,
          members,
        };
      }),
    );
  }

  async findOne(id: number): Promise<any> {
    const studyGroup = await this.studyGroupRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    });

    if (!studyGroup) {
      throw new NotFoundException('Study group not found');
    }

    const members = await this.memberRepository.count({
      where: {
        studyGroupId: id,
      },
    });

    return {
      ...studyGroup,
      members,
    };
  }

  async join(
    studyGroupId: number,
    userId: number,
  ): Promise<{ message: string; members: number }> {
    const studyGroup = await this.studyGroupRepository.findOne({
      where: { id: studyGroupId },
    });

    if (!studyGroup) {
      throw new NotFoundException('Study group not found');
    }

    const existingMember = await this.memberRepository.findOne({
      where: {
        studyGroupId,
        userId,
      },
    });

    if (existingMember) {
      throw new ConflictException(
        'You have already joined this study group',
      );
    }

    await this.memberRepository.save({
      studyGroupId,
      userId,
    });

    const members = await this.memberRepository.count({
      where: {
        studyGroupId,
      },
    });

    return {
      message: 'You joined the study group successfully',
      members,
    };
  }

  async leave(
    studyGroupId: number,
    userId: number,
  ): Promise<{ message: string; members: number }> {
    const member = await this.memberRepository.findOne({
      where: {
        studyGroupId,
        userId,
      },
    });

    if (!member) {
      throw new NotFoundException(
        'You are not a member of this study group',
      );
    }

    await this.memberRepository.remove(member);

    const members = await this.memberRepository.count({
      where: {
        studyGroupId,
      },
    });

    return {
      message: 'You left the study group successfully',
      members,
    };
  }

  async isMember(
    studyGroupId: number,
    userId: number,
  ): Promise<{ isMember: boolean }> {
    const member = await this.memberRepository.findOne({
      where: {
        studyGroupId,
        userId,
      },
    });

    return {
      isMember: !!member,
    };
  }

  async update(
    id: number,
    updateData: UpdateStudyGroupDto,
    userId: number,
    role: string,
  ): Promise<StudyGroup> {
    const studyGroup = await this.studyGroupRepository.findOne({
      where: { id },
    });

    if (!studyGroup) {
      throw new NotFoundException('Study group not found');
    }

    if (studyGroup.userId !== userId && role !== 'admin') {
      throw new ForbiddenException(
        'You can only edit your own study groups',
      );
    }

    Object.assign(studyGroup, updateData);

    return this.studyGroupRepository.save(studyGroup);
  }

  async remove(
    id: number,
    userId: number,
    role: string,
  ): Promise<{ message: string }> {
    const studyGroup = await this.studyGroupRepository.findOne({
      where: { id },
    });

    if (!studyGroup) {
      throw new NotFoundException('Study group not found');
    }

    if (studyGroup.userId !== userId && role !== 'admin') {
      throw new ForbiddenException(
        'You can only delete your own study groups',
      );
    }

    await this.studyGroupRepository.remove(studyGroup);

    return {
      message: 'Study group deleted successfully',
    };
  }
}
