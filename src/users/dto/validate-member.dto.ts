import {
  IsEmail,
  IsString,
  IsOptional,
} from 'class-validator';

export class ValidateMemberDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  unique_number: string;
}