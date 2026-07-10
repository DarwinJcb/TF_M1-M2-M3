import { Module } from '@nestjs/common';
import { RestriccionesService } from './restricciones.service';
import { RestriccionesController } from './restricciones.controller';

@Module({
  controllers: [RestriccionesController],
  providers: [RestriccionesService],
})
export class RestriccionesModule {}
