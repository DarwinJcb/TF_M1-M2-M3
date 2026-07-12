/* src/app.module.ts: */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatsModule } from './chats/chats.module';
import { CondicionesComunicacionModule } from './condiciones-comunicacion/condiciones-comunicacion.module';
import { FotosModule } from './fotos/fotos.module';
import { InteraccionesModule } from './interacciones/interacciones.module';
import { InteresesModule } from './intereses/intereses.module';
import { MatchesModule } from './matches/matches.module';
import { MensajesModule } from './mensajes/mensajes.module';
import { MusicasModule } from './musicas/musicas.module';
import { PagosModule } from './pagos/pagos.module';
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
    PagosModule,
    CondicionesComunicacionModule,
    InteraccionesModule,
    MatchesModule,
    ChatsModule,
    MensajesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
