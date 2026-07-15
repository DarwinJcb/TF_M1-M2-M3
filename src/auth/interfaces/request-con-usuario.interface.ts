/* tf_m1-m2-m3/src/auth/interfaces/request-con-usuario.interface.ts */
import { Request } from 'express';
import { UsuarioAutenticado } from './usuario-autenticado.interface';

export interface RequestConUsuario extends Request {
  user: UsuarioAutenticado;
}
