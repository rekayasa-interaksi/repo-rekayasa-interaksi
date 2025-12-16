import { Transform, Type } from 'class-transformer';
import {
  IsArray, IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { StatusEvents } from '../entities/event.entity';
import { DetailEventDto } from './detail-event.dto';
import { EventImagesDto } from './event-images.dto';
import { ExistImagesDto } from './exist-images.dto';

export class UpdateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  place: string;

  @IsString()
  @IsNotEmpty()
  program_id: string;

  @IsOptional()
  @IsString({ each: true })
  student_club_ids?: string[];

  @IsOptional()
  @IsString({ each: true })
  student_chapter_ids?: string[];

  @IsOptional()
  @IsString({ each: true })
  external_organization_ids?: string[];

  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsBoolean()
  @IsNotEmpty()
  event_activated: boolean;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsEnum(StatusEvents)
  @IsOptional()
  status: StatusEvents;

  @IsString()
  @IsOptional()
  zoom?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsString()
  @IsNotEmpty()
  term_of_reference: string;

  @IsString()
  @IsNotEmpty()
  rules: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailEventDto)
  @IsNotEmpty()
  detail_events: DetailEventDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventImagesDto)
  @IsOptional()
  event_images: EventImagesDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExistImagesDto)
  @IsOptional()
  exist_images: ExistImagesDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExistImagesDto)
  @IsOptional()
  delete_images: ExistImagesDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExistImagesDto)
  @IsOptional()
  delete_detail_events: ExistImagesDto[];

  @IsString()
  @IsNotEmpty()
  program_category_id: string

  @IsString()
  @IsNotEmpty()
  program_type_id: string
}