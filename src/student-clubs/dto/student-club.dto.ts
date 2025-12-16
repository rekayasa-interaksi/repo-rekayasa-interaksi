import { IsNotEmpty, IsString } from 'class-validator';
export class StudentClubDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}