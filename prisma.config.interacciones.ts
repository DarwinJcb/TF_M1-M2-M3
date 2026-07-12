/* prisma.config.interacciones.ts: */
// npm install --save-dev prisma dotenv
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema-interacciones.prisma',
  migrations: {
    path: 'prisma/migrations-interacciones',
  },
  datasource: {
    url: process.env['DATABASE_URL_INTERACCIONES'],
  },
});