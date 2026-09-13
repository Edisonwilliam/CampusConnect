import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStudyGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  course: string;

  @IsNotEmpty()
  @IsString()
  level: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  meetingDay: string;

  @IsNotEmpty()
  @IsString()
  meetingTime: string;

  @IsNotEmpty()
  @IsString()
  location: string;
}