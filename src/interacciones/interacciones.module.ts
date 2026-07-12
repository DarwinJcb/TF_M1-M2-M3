/* src/interacciones/interacciones.module.ts: */
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { InteraccionesController } from './interacciones.controller';
import { InteraccionesService } from './interacciones.service';

@Module({
  imports: [PrismaModule],
  controllers: [InteraccionesController],
  providers: [InteraccionesService],
})
export class InteraccionesModule {}
