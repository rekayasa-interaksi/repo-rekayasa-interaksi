import { Transform } from 'class-transformer';
import { IsOptional, IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class CreateFaqDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsOptional()
  @IsString()
  answer: string;

  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsOptional()
  @IsBoolean()
  show: boolean;

  @IsOptional()
  @IsString()
  menu: string;
}
