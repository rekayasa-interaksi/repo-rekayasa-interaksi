import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsDateString,
  ValidateNested,
  IsUUID, ValidateIf,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SocialMediaDto } from './social-media.dto';

export class CreateMemberDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsDateString()
  @IsNotEmpty()
  birthday: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  @IsEnum(['L', 'P'], {
    message: 'gender hanya boleh bernilai L atau P',
  })
  gender?: 'L' | 'P';

  @IsString()
  @MaxLength(4)
  @IsNotEmpty()
  generation: string;

  @IsUUID()
  @IsOptional()
  program_alumni_id?: string;

  @IsOptional()
  @IsUUID()
  student_club_id?: string;

  @IsUUID()
  @IsOptional()
  student_chapter_id?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialMediaDto)
  social_media?: SocialMediaDto;

  @ValidateIf((o) => !o.major_campus_name)
  @IsUUID()
  @IsOptional()
  major_campus_id?: string;

  @ValidateIf((o) => !o.major_campus_id)
  @IsString()
  @IsOptional()
  major_campus_name?: string;

  @ValidateIf((o) => !o.student_campus_name)
  @IsUUID()
  @IsOptional()
  student_campus_id?: string;

  @ValidateIf((o) => !o.student_campus_id)
  @IsString()
  @IsOptional()
  student_campus_name?: string;

  @ValidateIf((o) => !o.domisili_name)
  @IsUUID()
  @IsOptional()
  domisili_id?: string;

  @ValidateIf((o) => !o.domisili_id)
  @IsString()
  @IsOptional()
  domisili_name?: string;
}