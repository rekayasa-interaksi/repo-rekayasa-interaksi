import { IsEnum, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SortDto } from '../../events/dto/sort.dto';
export class QueryGetAllCommonDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  query?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SortDto)
  sort?: SortDto;
}