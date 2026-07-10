/* src/ventajas/ventajas.module.ts: */
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { VentajasController } from './ventajas.controller';
import { VentajasService } from './ventajas.service';

@Module({
  imports: [PrismaModule],
  controllers: [VentajasController],
  providers: [VentajasService],
})
export class VentajasModule {}
