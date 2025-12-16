import { IsEmail, IsString, MinLength, IsDateString, IsOptional, IsNotEmpty } from 'class-validator';

export class LoggingRequestDto {
  @IsString()
  @IsOptional()
  client_ip: string

  @IsString()
  @IsNotEmpty()
  type: string
}
