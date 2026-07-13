/* src/suscripciones/suscripciones.module.ts: */
import { Module } from '@nestjs/common';
import { PrismaSuscripcionesModule } from '../prisma-suscripciones/prisma-suscripciones.module';
import { PrismaUsuariosModule } from '../prisma-usuarios/prisma-usuarios.module';
import { SuscripcionesController } from './suscripciones.controller';
import { SuscripcionesService } from './suscripciones.service';

@Module({
  imports: [PrismaSuscripcionesModule, PrismaUsuariosModule],
  controllers: [SuscripcionesController],
  providers: [SuscripcionesService],
})
export class SuscripcionesModule {}
