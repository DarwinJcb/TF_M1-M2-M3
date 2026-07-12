/* src/suscripciones/suscripciones.module.ts: */
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SuscripcionesController } from './suscripciones.controller';
import { SuscripcionesService } from './suscripciones.service';

@Module({
  imports: [PrismaModule],
  controllers: [SuscripcionesController],
  providers: [SuscripcionesService],
})
export class SuscripcionesModule {}
