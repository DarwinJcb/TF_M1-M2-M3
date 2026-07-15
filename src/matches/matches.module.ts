/* tf_m1-m2-m3/src/matches/matches.module.ts */
import { Module } from '@nestjs/common';
import { PrismaInteraccionesModule } from '../prisma-interacciones/prisma-interacciones.module';
import { PrismaUsuariosModule } from '../prisma-usuarios/prisma-usuarios.module';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

@Module({
  imports: [PrismaInteraccionesModule, PrismaUsuariosModule],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
