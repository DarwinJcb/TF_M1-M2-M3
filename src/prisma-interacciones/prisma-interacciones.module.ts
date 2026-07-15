/* tf_m1-m2-m3/src/prisma-interacciones/prisma-interacciones.module.ts */
import { Module } from '@nestjs/common';
import { PrismaInteraccionesService } from './prisma-interacciones.service';

@Module({
  providers: [PrismaInteraccionesService],
  exports: [PrismaInteraccionesService],
})
export class PrismaInteraccionesModule {}
