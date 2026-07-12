BEGIN;

-- Renombrar la tabla sin eliminar sus registros
ALTER TABLE "SuscripcionUsuario"
RENAME TO "Suscripcion";

-- Renombrar la llave primaria
ALTER TABLE "Suscripcion"
RENAME COLUMN "IdSuscripcionUsuario" TO "IdSuscripcion";

-- Renombrar la llave foránea almacenada en Pago
ALTER TABLE "Pago"
RENAME COLUMN "SuscripcionUsuarioFK" TO "SuscripcionFK";

-- Renombrar la restricción de llave primaria
ALTER TABLE "Suscripcion"
RENAME CONSTRAINT "SuscripcionUsuario_pkey"
TO "Suscripcion_pkey";

-- Renombrar las restricciones de relaciones
ALTER TABLE "Suscripcion"
RENAME CONSTRAINT "SuscripcionUsuario_UsuarioFK_fkey"
TO "Suscripcion_UsuarioFK_fkey";

ALTER TABLE "Suscripcion"
RENAME CONSTRAINT "SuscripcionUsuario_PlanSuscripcionFK_fkey"
TO "Suscripcion_PlanSuscripcionFK_fkey";

ALTER TABLE "Pago"
RENAME CONSTRAINT "Pago_SuscripcionUsuarioFK_fkey"
TO "Pago_SuscripcionFK_fkey";

-- Renombrar el índice único del usuario
ALTER INDEX "SuscripcionUsuario_UsuarioFK_key"
RENAME TO "Suscripcion_UsuarioFK_key";

-- Renombrar la secuencia del ID autoincremental
ALTER SEQUENCE "SuscripcionUsuario_IdSuscripcionUsuario_seq"
RENAME TO "Suscripcion_IdSuscripcion_seq";

COMMIT;