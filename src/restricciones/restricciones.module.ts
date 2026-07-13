/* src/restricciones/restricciones.module.ts: */
import { Module } from '@nestjs/common';
import { PrismaSuscripcionesModule } from '../prisma-suscripciones/prisma-suscripciones.module';
import { RestriccionesController } from './restricciones.controller';
import { RestriccionesService } from './restricciones.service';

@Module({
  imports: [PrismaSuscripcionesModule],
  controllers: [RestriccionesController],
  providers: [RestriccionesService],
})
export class RestriccionesModule { }