import { IsEmail, IsString, MinLength, IsUUID, IsEnum, IsNotEmpty, IsBoolean } from 'class-validator';

export class RegisterAdminDto {
  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty()
  email: string;

  // @IsUUID(4, { message: 'User ID must be a valid UUID' })
  // user_id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  // @IsEnum(['admin', 'superadmin'], { message: 'Role must be either admin or superadmin' })
  @IsUUID(4, { message: 'Role ID must be a valid UUID' })
  @IsNotEmpty()
  role_id: string;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
