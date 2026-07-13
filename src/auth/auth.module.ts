/* src/auth/auth.module.ts: */
import 'dotenv/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaUsuariosModule } from '../prisma-usuarios/prisma-usuarios.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const DURACION_TOKEN_SEGUNDOS = 60 * 60 * 24 * 30;

function obtenerSecretoJwt(): string {
  const secretoJwt = process.env['JWT_SECRET'];

  if (!secretoJwt) {
    throw new Error(
      'La variable de entorno JWT_SECRET no está definida en el archivo .env.',
    );
  }

  return secretoJwt;
}

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
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
