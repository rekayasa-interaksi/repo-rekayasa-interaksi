import { IsDateString, IsOptional, IsString, IsInt, Min, Max, Matches } from 'class-validator';
import { QueryDto } from 'src/events/dto/query.dto';

export class QueryHistoryDto extends QueryDto {
  @IsOptional()
  @Matches(/^\d{4}$/, { message: 'year must be a 4-digit number' })
  year?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(year|month)$/, { message: 'groupBy must be one of the following: month or year' })
  group?: string;
}
