/* src/planes-suscripcion/planes-suscripcion.module.ts: */
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PlanesSuscripcionController } from './planes-suscripcion.controller';
import { PlanesSuscripcionService } from './planes-suscripcion.service';

@Module({
  imports: [PrismaModule],
  controllers: [PlanesSuscripcionController],
  providers: [PlanesSuscripcionService],
})
export class PlanesSuscripcionModule { }