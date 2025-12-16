import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    const req = context.switchToHttp().getRequest<Request>();

    const cookieToken = req.cookies?.token;

    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    const token = cookieToken || bearerToken;

    if (isPublic && !token) {
      return true;
    }

    if (!token) {
      if (isPublic) return true;
      throw new UnauthorizedException('No token provided');
    }

    let payload: any = null;

    try {
      payload = jwt.verify(token, process.env.JWT_KEY_ADMIN);
      req.user = { ...payload };
      return true;
    } catch (err) {
      console.log('Admin JWT verification failed:', err.message);
    }

    try {
      payload = jwt.verify(token, process.env.JWT_KEY_MEMBER);
      req.user = { ...payload };
      return true;
    } catch (err) {
      console.log('Member JWT verification failed:', err.message);
    }

    if (isPublic) {
      console.log('Invalid token on public route, allowing access without user');
      return true;
    }

    throw new UnauthorizedException('Invalid or expired token');
  }
}
