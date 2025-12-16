import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class HelpCenterDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsEmail()
  @IsOptional()
  email: string;
}