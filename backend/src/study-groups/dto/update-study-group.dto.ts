import { PartialType } from '@nestjs/mapped-types';
import { CreateStudyGroupDto } from './create-study-group.dto';

export class UpdateStudyGroupDto extends PartialType(
  CreateStudyGroupDto,
) {}