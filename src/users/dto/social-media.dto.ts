import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class SocialMediaDto {
  @ValidateIf((_, value) => value !== '')
  @IsNotEmpty()
  @IsString()
  instagram?: string;

  @ValidateIf((_, value) => value !== '')
  @IsOptional()
  @IsString()
  telegram?: string;

  @ValidateIf((_, value) => value !== '')
  @IsNotEmpty()
  @IsString()
  linkedin?: string;
}
