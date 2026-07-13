/* src/mensajes/mensajes.module.ts: */
import { Module } from '@nestjs/common';
import { PrismaInteraccionesModule } from '../prisma-interacciones/prisma-interacciones.module';
import { PrismaUsuariosModule } from '../prisma-usuarios/prisma-usuarios.module';
import { MensajesController } from './mensajes.controller';
import { MensajesService } from './mensajes.service';

@Module({
  imports: [PrismaInteraccionesModule, PrismaUsuariosModule],
  controllers: [MensajesController],
  providers: [MensajesService],
})
export class MensajesModule {}
