import { IsEnum, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SortDto } from '../../events/dto/sort.dto';
export class QueryGetAllDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  query?: string;

  @IsString()
  @IsOptional()
  domisili_id?: string;

  @IsString()
  @IsOptional()
  campus_id?: string;

  @IsString()
  @IsOptional()
  student_club_id?: string;

  @IsString()
  @IsOptional()
  student_chapter_id?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SortDto)
  sort?: SortDto;

  @IsString()
  @IsOptional()
  role_id?: string;
}