import { IsDateString, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class DetailEventDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  client_id: string;

  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'start_time must be in HH:mm format',
  })
  @IsNotEmpty()
  start_time: string;

  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'end_time must be in HH:mm format',
  })
  @IsNotEmpty()
  end_time: string;
}