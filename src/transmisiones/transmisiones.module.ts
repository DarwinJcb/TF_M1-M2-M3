/* src/transmisiones/transmisiones.module.ts: */
import { Module } from '@nestjs/common';
import { TransmisionesService } from './transmisiones.service';
import { TransmisionesController } from './transmisiones.controller';

@Module({
  controllers: [TransmisionesController],
  providers: [TransmisionesService],
})
export class TransmisionesModule { }
