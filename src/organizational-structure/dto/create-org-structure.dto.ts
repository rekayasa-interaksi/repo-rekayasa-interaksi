import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { SocialMediaDto } from './social-media.dto';
import { Type } from 'class-transformer';

export class CreateOrganizationalStructureDto {
  @IsEnum(['digistar_club', 'student_club', 'campus_chapter'])
  @IsNotEmpty()
  type: 'digistar_club' | 'student_club' | 'campus_chapter';

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsOptional()
  generation?: string;

  @IsOptional()
  @IsString()
  student_club_id?: string;

  @IsOptional()
  @IsString()
  student_chapter_id?: string;

  @IsOptional()
  @IsString()
  user_id?: string;
}
