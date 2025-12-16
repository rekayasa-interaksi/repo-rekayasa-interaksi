import { IsNotEmpty, IsString } from 'class-validator';
export class ProgramAlumniDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}