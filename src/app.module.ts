/* src/app.module.ts: */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InteresesModule } from './intereses/intereses.module';
import { UbicacionesModule } from './ubicaciones/ubicaciones.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { FotosModule } from './fotos/fotos.module';

@Module({
  imports: [UsuariosModule, UbicacionesModule, InteresesModule, FotosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
