/* src/donaciones/donaciones.module.ts: */
import { Module } from '@nestjs/common';
import { PrismaUsuariosModule } from '../prisma-usuarios/prisma-usuarios.module';
import { DonacionesController } from './donaciones.controller';
import { DonacionesService } from './donaciones.service';

@Module({
  imports: [PrismaUsuariosModule],
  controllers: [DonacionesController],
  providers: [DonacionesService],
})
export class DonacionesModule {}
