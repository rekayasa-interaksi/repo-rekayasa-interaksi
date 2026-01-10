import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class FeedbackEventDto {
  // @IsString()
  // @IsNotEmpty()
  // duration: string;

  @IsString()
  @IsNotEmpty()
  detail_event_id: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  material_quality: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  delivery_quality: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  experience: number;

  @IsString()
  @IsNotEmpty()
  testimoni: string;

  @IsString()
  @IsNotEmpty()
  improvement: string;

  @IsString()
  @IsNotEmpty()
  favorite: string;

  @IsString()
  @IsNotEmpty()
  next_topic: string;

  @IsString()
  @IsNotEmpty()
  suggest: string;

  @IsString()
  @IsOptional()
  unique_number?: string;

  @IsString()
  @IsOptional()
  email?: string;

  // Employer Branding
  @IsString()
  @IsNotEmpty()
  recomendation_reason: string

  @IsString()
  @IsNotEmpty()
  alteration: string

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(10)
  recomendation_company: number;
}