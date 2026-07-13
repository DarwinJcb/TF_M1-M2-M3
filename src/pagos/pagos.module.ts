/* src/pagos/pagos.module.ts: */
import { Module } from '@nestjs/common';
import { PrismaSuscripcionesModule } from '../prisma-suscripciones/prisma-suscripciones.module';
import { PrismaUsuariosModule } from '../prisma-usuarios/prisma-usuarios.module';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';

@Module({
  imports: [PrismaSuscripcionesModule, PrismaUsuariosModule],
  controllers: [PagosController],
  providers: [PagosService],
})
export class PagosModule { }
