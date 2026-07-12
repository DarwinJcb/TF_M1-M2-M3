/* src/app.module.ts: */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatsModule } from './chats/chats.module';
import { CondicionesComunicacionModule } from './condiciones-comunicacion/condiciones-comunicacion.module';
import { DonacionesModule } from './donaciones/donaciones.module';
import { FotosModule } from './fotos/fotos.module';
import { InteraccionesModule } from './interacciones/interacciones.module';
import { InteresesModule } from './intereses/intereses.module';
import { MatchesModule } from './matches/matches.module';
import { MensajesModule } from './mensajes/mensajes.module';
import { MusicasModule } from './musicas/musicas.module';
import { PagosModule } from './pagos/pagos.module';
import { PlanesSuscripcionModule } from './planes-suscripcion/planes-suscripcion.module';
import { ReportesModule } from './reportes/reportes.module';
import { RestriccionesModule } from './restricciones/restricciones.module';
import { SuscripcionesModule } from './suscripciones/suscripciones.module';
import { TransmisionesModule } from './transmisiones/transmisiones.module';
import { UbicacionesModule } from './ubicaciones/ubicaciones.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { VentajasModule } from './ventajas/ventajas.module';
import { PrismaUsuariosModule } from './prisma-usuarios/prisma-usuarios.module';
import { PrismaInteraccionesModule } from './prisma-interacciones/prisma-interacciones.module';
import { PrismaSuscripcionesModule } from './prisma-suscripciones/prisma-suscripciones.module';

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
    SuscripcionesModule,
    PagosModule,
    CondicionesComunicacionModule,
    InteraccionesModule,
    MatchesModule,
    ChatsModule,
    MensajesModule,
    ReportesModule,
    TransmisionesModule,
    DonacionesModule,
    PrismaUsuariosModule,
    PrismaInteraccionesModule,
    PrismaSuscripcionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
