import { IsEmail, IsString, MinLength, IsUUID, IsNotEmpty, IsBoolean, IsArray, ArrayMinSize } from 'class-validator';

export class CreateTeamDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  role: string[];

  @IsString()
  @IsNotEmpty()
  generation: string;

  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}
