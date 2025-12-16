import { IsString, IsOptional } from 'class-validator';
import { QueryDto } from 'src/events/dto/query.dto';

export class QueryFaqDto extends QueryDto {
  @IsString()
  @IsOptional()
  menu?: string;

  @IsOptional()
  show?: boolean;
}