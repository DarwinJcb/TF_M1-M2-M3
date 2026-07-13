/* src/auth/jwt.strategy.ts: */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { obtenerSecretoJwt } from './config/jwt.config';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsuarioAutenticado } from './interfaces/usuario-autenticado.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: obtenerSecretoJwt(),
    });
  }

  validate(payload: JwtPayload): UsuarioAutenticado {
    return {
      IdUsuario: payload.sub,
      correo: payload.correo,
    };
  }
}
