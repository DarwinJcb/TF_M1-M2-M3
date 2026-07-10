/* src/app.module.ts: */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FotosModule } from './fotos/fotos.module';
import { InteresesModule } from './intereses/intereses.module';
import { MusicasModule } from './musicas/musicas.module';
import { PlanesSuscripcionModule } from './planes-suscripcion/planes-suscripcion.module';
import { RestriccionesModule } from './restricciones/restricciones.module';
import { SuscripcionesUsuariosModule } from './suscripciones-usuarios/suscripciones-usuarios.module';
import { UbicacionesModule } from './ubicaciones/ubicaciones.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { VentajasModule } from './ventajas/ventajas.module';

@Module({
  imports: [
    UsuariosModule,
    UbicacionesModule,
    InteresesModule,
    FotosModule,
    MusicasModule,
    PlanesSuscripcionModule,
    VentajasModule,
    RestriccionesModule,
    SuscripcionesUsuariosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }