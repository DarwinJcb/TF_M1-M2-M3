/* src/auth/auth.service.ts: */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaUsuariosService } from '../prisma-usuarios/prisma-usuarios.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RespuestaLogin } from './interfaces/respuesta-login.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaUsuarios: PrismaUsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<RespuestaLogin> {
    const usuario = await this.prismaUsuarios.usuario.findUnique({
      where: {
        correo: loginDto.correo,
      },
      select: {
        IdUsuario: true,
        correo: true,
        contrasenaHash: true,
      },
    });

    if (!usuario?.contrasenaHash) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    }

    const contrasenaValida = await bcrypt.compare(
      loginDto.contrasena,
      usuario.contrasenaHash,
    );

    if (!contrasenaValida) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    }

    const payload: JwtPayload = {
      sub: usuario.IdUsuario,
      correo: usuario.correo,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
    };
  }
}
