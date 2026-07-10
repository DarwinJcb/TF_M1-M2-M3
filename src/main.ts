/* src/main.ts: */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error: unknown): void => {
  const message = error instanceof Error ? error.message : 'Error desconocido';
  console.error('Error al iniciar la aplicación:', message);
  process.exitCode = 1;
});