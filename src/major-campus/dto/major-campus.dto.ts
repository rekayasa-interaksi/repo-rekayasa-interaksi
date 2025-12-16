import { IsNotEmpty, IsString } from 'class-validator';
export class MajorCampusDto {
  @IsString()
  @IsNotEmpty()
  major: string;
}