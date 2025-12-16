import {
  IsBoolean,
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  MaxLength, ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DetailEventDto } from './detail-event.dto';

export class RegisterEventDto {
  @IsString()
  event_id: string;

  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsBoolean()
  @IsOptional()
  is_validate: boolean;

  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsBoolean()
  @IsOptional()
  is_active: boolean;

  @IsOptional()
  @IsString()
  unique_number?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  generation?: string;

  @IsOptional()
  @IsString()
  student_campus_id?: string;

  @IsOptional()
  @IsString()
  student_campus_name?: string;

  @IsOptional()
  @IsString()
  major_campus_id?: string;

  @IsOptional()
  @IsString()
  major_campus_name?: string;

  @IsOptional()
  @IsString()
  domisili_id?: string;

  @IsOptional()
  @IsString()
  domisili_name?: string;
}