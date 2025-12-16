import { IsOptional, IsString } from 'class-validator';
import { QueryDto } from './query.dto';
export class QueryEventDto extends QueryDto {
  @IsString()
  @IsOptional()
  student_club_id?: string;

  @IsString()
  @IsOptional()
  student_chapter_id?: string;

  @IsString()
  @IsOptional()
  external_organization_id?: string;

  @IsString()
  @IsOptional()
  program_id?: string;
}