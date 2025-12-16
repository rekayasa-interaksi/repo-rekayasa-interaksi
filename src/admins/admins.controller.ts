import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Post('register')
  async register(@Body() registerAdminDto: RegisterAdminDto, @Req() req) {
    return this.adminsService.createAdmin(registerAdminDto, req.user);  
  }
}
