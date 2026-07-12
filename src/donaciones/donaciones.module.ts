/* src/donaciones/donaciones.module.ts: */
import { Module } from '@nestjs/common';
import { DonacionesService } from './donaciones.service';
import { DonacionesController } from './donaciones.controller';

@Module({
  controllers: [DonacionesController],
  providers: [DonacionesService],
})
export class DonacionesModule {}
