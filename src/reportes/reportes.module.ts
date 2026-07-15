/* tf_m1-m2-m3/src/reportes/reportes.module.ts */
import { Module } from '@nestjs/common';
import { PrismaInteraccionesModule } from '../prisma-interacciones/prisma-interacciones.module';
import { PrismaUsuariosModule } from '../prisma-usuarios/prisma-usuarios.module';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';

@Module({
  imports: [PrismaInteraccionesModule, PrismaUsuariosModule],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
