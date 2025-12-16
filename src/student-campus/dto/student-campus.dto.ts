import { IsNotEmpty, IsString } from 'class-validator';
export class StudentCampusDto {
  @IsString()
  @IsNotEmpty()
  institute: string;
}