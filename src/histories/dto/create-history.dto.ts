import { IsDateString, IsOptional, IsString, IsInt, Min, Max, Matches, IsNotEmpty } from 'class-validator';

export class CreateHistoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
  @IsNotEmpty()
  date: string;
}
