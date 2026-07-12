/* prisma.config.usuarios.ts: */
// npm install --save-dev prisma dotenv
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.usuarios.prisma',
  migrations: {
    path: 'prisma/migrations-usuarios',
  },
  datasource: {
    url: process.env['DATABASE_URL_USUARIOS'],
  },
});