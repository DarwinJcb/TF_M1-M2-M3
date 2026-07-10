/* src/app.module.ts: */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { UbicacionesModule } from './ubicaciones/ubicaciones.module';

@Module({
  imports: [PrismaModule, UsuariosModule, UbicacionesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
