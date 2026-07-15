/* tf_m1-m2-m3/src/prisma-suscripciones/prisma-suscripciones.module.ts */
import { Module } from '@nestjs/common';
import { PrismaSuscripcionesService } from './prisma-suscripciones.service';

@Module({
  providers: [PrismaSuscripcionesService],
  exports: [PrismaSuscripcionesService],
})
export class PrismaSuscripcionesModule {}
