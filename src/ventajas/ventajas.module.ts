/* tf_m1-m2-m3/src/ventajas/ventajas.module.ts */
import { Module } from '@nestjs/common';
import { PrismaSuscripcionesModule } from '../prisma-suscripciones/prisma-suscripciones.module';
import { VentajasController } from './ventajas.controller';
import { VentajasService } from './ventajas.service';

@Module({
  imports: [PrismaSuscripcionesModule],
  controllers: [VentajasController],
  providers: [VentajasService],
})
export class VentajasModule {}
