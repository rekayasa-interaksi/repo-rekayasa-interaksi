import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AchievementDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsNumber()
  sequence?: number;

  @IsOptional()
  @IsNumber()
  point?: number;

  @IsString()
  @IsNotEmpty()
  detail_event_id: string;

  @IsString()
  @IsNotEmpty()
  user_id:  string;
}