/* src/prisma-interacciones/prisma-interacciones.module.ts: */
import { Module } from '@nestjs/common';
import { PrismaInteraccionesService } from './prisma-interacciones.service';

@Module({
    providers: [PrismaInteraccionesService]
})
export class PrismaInteraccionesModule { }
