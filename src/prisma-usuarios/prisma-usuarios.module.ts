/* tf_m1-m2-m3/src/prisma-usuarios/prisma-usuarios.module.ts */
import { Module } from '@nestjs/common';
import { PrismaUsuariosService } from './prisma-usuarios.service';

@Module({
  providers: [PrismaUsuariosService],
  exports: [PrismaUsuariosService],
})
export class PrismaUsuariosModule {}
