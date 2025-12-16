import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class SortDto {
  @IsOptional()
  @IsIn([0, 1], { message: 'Sort value must be 0 (ASC) or 1 (DESC)' })
  name?: number;

  @IsOptional()
  @IsIn([0, 1], { message: 'Sort value must be 0 (ASC) or 1 (DESC)' })
  created_at?: number;
}