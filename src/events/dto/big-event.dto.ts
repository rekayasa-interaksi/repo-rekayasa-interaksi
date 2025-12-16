import { Transform } from 'class-transformer';
import { QueryDto } from './query.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class BigEventDto extends QueryDto {
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean

  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsOptional()
  @IsBoolean()
  is_big?: boolean;

  @IsString()
  @IsOptional()
  event_id?: string;

  @IsString()
  @IsOptional()
  detail_event_id?: string;
}