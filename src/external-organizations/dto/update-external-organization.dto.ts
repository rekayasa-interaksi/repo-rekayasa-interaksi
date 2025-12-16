import { IsString, IsDateString, IsOptional, Matches } from 'class-validator';

export class UpdateExternalDto {
  @IsOptional()
  @IsString()
  name?: string;
}
