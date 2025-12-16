import { IsDateString, IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class SocialMediaDto {
  @IsString()
  @IsNotEmpty()
  instagram: string;

  @IsString()
  @IsNotEmpty()
  whatsapp: string;

  @IsEmail()
  @IsNotEmpty()
  mail: string;
}