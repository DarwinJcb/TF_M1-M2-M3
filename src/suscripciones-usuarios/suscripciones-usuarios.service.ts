/* src/suscripciones-usuarios/suscripciones-usuarios.service.ts: */
import { Injectable } from '@nestjs/common';
import { CreateSuscripcionUsuarioDto } from './dto/create-suscripcion-usuario.dto';
import { UpdateSuscripcionUsuarioDto } from './dto/update-suscripcion-usuario.dto';

@Injectable()
export class SuscripcionesUsuariosService {
  create(createSuscripcionesUsuarioDto: CreateSuscripcionUsuarioDto) {
    return 'This action adds a new suscripcionesUsuario';
  }

  findAll() {
    return `This action returns all suscripcionesUsuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} suscripcionesUsuario`;
  }

  update(id: number, updateSuscripcionesUsuarioDto: UpdateSuscripcionUsuarioDto) {
    return `This action updates a #${id} suscripcionesUsuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} suscripcionesUsuario`;
  }
}
