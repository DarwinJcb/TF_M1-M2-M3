/* tf_m1-m2-m3/src/prisma-interacciones/prisma-interacciones.service.ts */
import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma-interacciones/client';

function obtenerUrlBaseDatosInteracciones(): string {
  const urlBaseDatos = process.env['DATABASE_URL_INTERACCIONES'];

  if (!urlBaseDatos) {
    throw new Error(
      'La variable de entorno DATABASE_URL_INTERACCIONES no está definida en el archivo .env.',
    );
  }

  return urlBaseDatos;
}

@Injectable()
export class PrismaInteraccionesService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: obtenerUrlBaseDatosInteracciones(),
    });

    super({ adapter });
  }
}
