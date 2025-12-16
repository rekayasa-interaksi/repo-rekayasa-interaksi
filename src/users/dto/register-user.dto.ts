import { IsEmail, IsString, MinLength, IsDateString, IsNotEmpty, IsEnum } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsDateString()
  birthday: string;

  @IsString()
  status: string;

  @IsString()
  regional_origin: string;

  @IsEnum(['L', 'P'], {
    message: 'gender hanya boleh bernilai L atau P',
  })
  gender: 'L' | 'P';

  @IsString()
  @MinLength(6)
  password: string;
}
