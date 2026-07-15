/* tf_m1-m2-m3/src/prisma/prisma.service.ts */
import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

function obtenerUrlBaseDatos(): string {
  const urlBaseDatos = process.env['DATABASE_URL'];
  if (!urlBaseDatos) {
    throw new Error(
      'La variable de entorno DATABASE_URL no está definida en el archivo .env.',
    );
  }
  return urlBaseDatos;
}

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: obtenerUrlBaseDatos(),
    });
    super({ adapter });
  }
}
