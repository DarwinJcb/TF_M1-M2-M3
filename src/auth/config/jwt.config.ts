/* tf_m1-m2-m3/src/auth/config/jwt.config.ts */
import 'dotenv/config';

export const DURACION_TOKEN_SEGUNDOS = 60 * 60 * 24 * 30;

export function obtenerSecretoJwt(): string {
  const secretoJwt = process.env['JWT_SECRET'];

  if (!secretoJwt) {
    throw new Error(
      'La variable de entorno JWT_SECRET no está definida en el archivo .env.',
    );
  }

  return secretoJwt;
}
