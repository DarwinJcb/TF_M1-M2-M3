/* src/suscripciones-usuarios/suscripciones-usuarios.module.ts: */
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SuscripcionesUsuariosController } from './suscripciones-usuarios.controller';
import { SuscripcionesUsuariosService } from './suscripciones-usuarios.service';

@Module({
  imports: [PrismaModule],
  controllers: [SuscripcionesUsuariosController],
  providers: [SuscripcionesUsuariosService],
})
export class SuscripcionesUsuariosModule {}
