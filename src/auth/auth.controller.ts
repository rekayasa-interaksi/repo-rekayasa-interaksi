import { Controller, Post, Body, Res, UseGuards, Delete, HttpStatus, HttpCode, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() loginDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.loginUser(loginDto, res);
  }

  @Post('administrator/login')
  @HttpCode(HttpStatus.OK)
  async loginAdmin(@Body() loginDto: LoginAdminDto) {
    return this.authService.loginAdmin(loginDto);
  }

  @Get('check-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('public', 'member')
  async checkAuthStatus(@Req() req: any) {
    return this.authService.checkAuthStatus(req);
  }

  @Delete('logout')
  @UseGuards(JwtAuthGuard)
  async logoutUser(@Res() res: Response) {
    return this.authService.logout(res);
  }

}
