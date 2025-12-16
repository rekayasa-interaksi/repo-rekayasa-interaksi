import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AdminsService } from '../admins/admins.service';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { RegisterAdminDto } from '../admins/dto/register-admin.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private adminsService: AdminsService,
    private readonly jwtService: JwtService,

    @Inject('JWT_ADMIN_SERVICE')
    private readonly jwtAdminService: JwtService
  ) { }

  async loginUser(loginDto: LoginUserDto, res: Response) {
    const user = await this.usersService.findOneByUsername(loginDto.email);

    if (!user) { 
      throw new UnauthorizedException('Username atau Password tidak valid');
    }
    
    // if (!user.is_validate) {
    //   throw new UnauthorizedException('Akunmu belum divalidasi oleh admin');
    // }

    if (!user.is_active) {
      throw new UnauthorizedException('Akunmu belum aktif');
    }

    const isMatch = await user.validatePassword(loginDto.password);
    if (!isMatch) throw new UnauthorizedException('Username atau Password tidak valid');

    const expiresIn = loginDto.remember_me ? '7d' : '3h';
    const maxAge = loginDto.remember_me ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 3;
    const payload = { sub: user.id, email: user.email, role: user.role.name };
    const token = this.jwtService.sign(payload, { expiresIn });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge,
      path: '/'
    });
    res.cookie('logged_in', true, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge,
      path: '/'
    });

    return {
      data: {unique_number: user.unique_number, name: user.name, role: user.role.name},
      status: 'success',
      message: 'Login successful',
    };
  }

  async checkAuthStatus(req: any) {
    const token = req.cookies?.token;

    if (!token) {
      throw new UnauthorizedException('You are not authorized user');
    }

    try {
      const decoded = this.jwtService.verify(token);
      return {
        status: 'success',
        data: decoded,
      };
    } catch (error) {
      throw new UnauthorizedException('Token is invalid or has expired');
    }
  }

  async logout(res: Response) {
    res.clearCookie('token');
    res.clearCookie('logged_in');
    return res.status(200).json({
      status: 'success',
      message: 'Logged Out successfully'
    });
  }

  async loginAdmin(loginDto: LoginAdminDto) {
    const admin = await this.adminsService.findAdminByEmail(loginDto.email);
    if (!admin) throw new UnauthorizedException("Email atau password tidak valid");

    if (admin.status == false) throw new UnauthorizedException("Akun anda sudah tidak aktif lagi, silahkan hubungi administrator");

    const isMatch = await bcrypt.compare(loginDto.password, admin.password);
    if (!isMatch) throw new UnauthorizedException('Email atau password tidak valid');

    const payload = { sub: admin.id, email: admin.email, role: admin.role.name };
    const token = this.jwtService.sign(payload, { expiresIn: '12h' });

    return {
      access_token: token,
      status: 'success',
      message: 'Login successful',
    };
  }
}
