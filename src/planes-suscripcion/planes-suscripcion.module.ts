/* src/planes-suscripcion/planes-suscripcion.module.ts: */
import { Module } from '@nestjs/common';
import { PlanesSuscripcionService } from './planes-suscripcion.service';
import { PlanesSuscripcionController } from './planes-suscripcion.controller';

@Module({
  controllers: [PlanesSuscripcionController],
  providers: [PlanesSuscripcionService],
})
export class PlanesSuscripcionModule { }
