/* src/ventajas/ventajas.module.ts: */
import { Module } from '@nestjs/common';
import { VentajasService } from './ventajas.service';
import { VentajasController } from './ventajas.controller';

@Module({
  controllers: [VentajasController],
  providers: [VentajasService],
})
export class VentajasModule { }
