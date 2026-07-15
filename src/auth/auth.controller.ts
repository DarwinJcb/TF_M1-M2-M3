/* tf_m1-m2-m3/src/auth/auth.controller.ts */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { RequestConUsuario } from './interfaces/request-con-usuario.interface';
import type { RespuestaLogin } from './interfaces/respuesta-login.interface';
import type { UsuarioAutenticado } from './interfaces/usuario-autenticado.interface';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto): Promise<RespuestaLogin> {
    return this.authService.login(loginDto);
  }

  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  obtenerPerfil(@Req() request: RequestConUsuario): UsuarioAutenticado {
    return request.user;
  }
}
