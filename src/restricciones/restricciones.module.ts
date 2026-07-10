/* src/restricciones/restricciones.module.ts: */
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RestriccionesController } from './restricciones.controller';
import { RestriccionesService } from './restricciones.service';

@Module({
  imports: [PrismaModule],
  controllers: [RestriccionesController],
  providers: [RestriccionesService],
})
export class RestriccionesModule {}
