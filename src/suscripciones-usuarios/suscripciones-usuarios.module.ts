/* src/suscripciones-usuarios/suscripciones-usuarios.module.ts: */
import { Module } from '@nestjs/common';
import { SuscripcionesUsuariosService } from './suscripciones-usuarios.service';
import { SuscripcionesUsuariosController } from './suscripciones-usuarios.controller';

@Module({
  controllers: [SuscripcionesUsuariosController],
  providers: [SuscripcionesUsuariosService],
})
export class SuscripcionesUsuariosModule { }
