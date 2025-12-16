import { IsNotEmpty, IsString } from 'class-validator';
export class ProgramsDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}