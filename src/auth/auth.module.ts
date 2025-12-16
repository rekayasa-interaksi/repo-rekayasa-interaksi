import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AdminsModule } from '../admins/admins.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    AdminsModule,
    JwtModule.register({
      secret: process.env.JWT_KEY_MEMBER,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    AuthService,
    // JwtStrategy,
    {
      provide: 'JWT_ADMIN_SERVICE',
      useFactory: () => {
        return new JwtService({
          secret: process.env.JWT_KEY_ADMIN,
          signOptions: { expiresIn: '30m' },
        });
      },
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
