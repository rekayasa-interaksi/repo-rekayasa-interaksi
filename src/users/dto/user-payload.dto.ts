import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsDateString,
  ValidateNested,
  IsUUID, ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SocialMediaDto } from './social-media.dto';

export class UserPayloadDto {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}