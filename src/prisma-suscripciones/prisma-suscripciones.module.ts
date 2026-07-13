/* src/prisma-suscripciones/prisma-suscripciones.module.ts: */
import { Module } from '@nestjs/common';
import { PrismaSuscripcionesService } from './prisma-suscripciones.service';

@Module({
    providers: [PrismaSuscripcionesService]
})
export class PrismaSuscripcionesModule { }
