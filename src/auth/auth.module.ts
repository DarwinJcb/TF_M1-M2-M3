/* src/auth/auth.module.ts: */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaUsuariosModule } from '../prisma-usuarios/prisma-usuarios.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  DURACION_TOKEN_SEGUNDOS,
  obtenerSecretoJwt,
} from './config/jwt.config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PrismaUsuariosModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: obtenerSecretoJwt(),
      signOptions: {
        expiresIn: DURACION_TOKEN_SEGUNDOS,
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
