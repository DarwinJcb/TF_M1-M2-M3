/* src/prisma-suscripciones/prisma-suscripciones.service.ts: */
import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma-suscripciones/client';

function obtenerUrlBaseDatosSuscripciones(): string {
  const urlBaseDatos = process.env['DATABASE_URL_SUSCRIPCIONES'];

  if (!urlBaseDatos) {
    throw new Error(
      'La variable de entorno DATABASE_URL_SUSCRIPCIONES no está definida en el archivo .env.',
    );
  }

  return urlBaseDatos;
}

@Injectable()
export class PrismaSuscripcionesService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: obtenerUrlBaseDatosSuscripciones(),
    });

    super({ adapter });
  }
}
