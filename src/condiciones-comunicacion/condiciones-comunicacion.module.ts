/* tf_m1-m2-m3/src/condiciones-comunicacion/condiciones-comunicacion.module.ts */
import { Module } from '@nestjs/common';
import { PrismaInteraccionesModule } from '../prisma-interacciones/prisma-interacciones.module';
import { CondicionesComunicacionController } from './condiciones-comunicacion.controller';
import { CondicionesComunicacionService } from './condiciones-comunicacion.service';

@Module({
  imports: [PrismaInteraccionesModule],
  controllers: [CondicionesComunicacionController],
  providers: [CondicionesComunicacionService],
})
export class CondicionesComunicacionModule {}
