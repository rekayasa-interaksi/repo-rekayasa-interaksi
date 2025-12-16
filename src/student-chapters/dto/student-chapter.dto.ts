import { IsNotEmpty, IsString } from 'class-validator';
export class StudentChapterDto {
  @IsString()
  @IsNotEmpty()
  institute: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}