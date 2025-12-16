import { IsNotEmpty, IsString, IsArray, IsDateString, IsOptional, Matches } from 'class-validator';

export class CreateExternalDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
