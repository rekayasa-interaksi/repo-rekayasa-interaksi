import { IsEnum, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { StatusEvents } from '../entities/event.entity';
import { Type } from 'class-transformer';
import { SortDto } from './sort.dto';
export class QueryDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  query?: string;

  @IsEnum(StatusEvents, { each: true })
  @IsOptional()
  status?: StatusEvents[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SortDto)
  sort?: SortDto;
}