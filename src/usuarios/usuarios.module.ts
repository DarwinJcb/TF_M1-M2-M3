/* src/usuarios/usuarios.module.ts: */
import { Module } from '@nestjs/common';
import { PrismaSuscripcionesModule } from '../prisma-suscripciones/prisma-suscripciones.module';
import { PrismaUsuariosModule } from '../prisma-usuarios/prisma-usuarios.module';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

@Module({
  imports: [PrismaUsuariosModule, PrismaSuscripcionesModule],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule { }