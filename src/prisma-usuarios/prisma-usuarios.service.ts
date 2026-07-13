/* src/prisma-usuarios/prisma-usuarios.service.ts: */
import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma-usuarios/client';

function obtenerUrlBaseDatosUsuarios(): string {
    const urlBaseDatos = process.env['DATABASE_URL_USUARIOS'];

    if (!urlBaseDatos) {
        throw new Error(
            'La variable de entorno DATABASE_URL_USUARIOS no está definida en el archivo .env.',
        );
    }

    return urlBaseDatos;
}

@Injectable()
export class PrismaUsuariosService extends PrismaClient {
    constructor() {
        const adapter = new PrismaPg({
            connectionString: obtenerUrlBaseDatosUsuarios(),
        });

        super({ adapter });
    }
}