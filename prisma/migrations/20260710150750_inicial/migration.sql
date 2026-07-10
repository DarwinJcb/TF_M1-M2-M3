-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMENINO');

-- CreateEnum
CREATE TYPE "SignoZodiacal" AS ENUM ('ARIES', 'TAURO', 'GEMINIS', 'CANCER', 'LEO', 'VIRGO', 'LIBRA', 'ESCORPIO', 'SAGITARIO', 'CAPRICORNIO', 'ACUARIO', 'PISCIS');

-- CreateEnum
CREATE TYPE "TipoPlan" AS ENUM ('BRONZE', 'GOLD', 'PREMIUM', 'PLATINUM');

-- CreateEnum
CREATE TYPE "TipoInteraccion" AS ENUM ('LIKE', 'DISLIKE', 'EVITAR', 'SUPERLIKE');

-- CreateEnum
CREATE TYPE "EstadoActividad" AS ENUM ('ONLINE', 'DESCONECTADO');

-- CreateEnum
CREATE TYPE "EstadoTransmision" AS ENUM ('LIVE', 'FINALIZADA');

-- CreateTable
CREATE TABLE "Usuario" (
    "IdUsuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "edad" INTEGER NOT NULL,
    "biografia" TEXT,
    "peso" DOUBLE PRECISION,
    "altura" DOUBLE PRECISION,
    "nacionalidad" TEXT NOT NULL,
    "genero" "Genero" NOT NULL,
    "ciudad" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "numeroTelefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "estadoActividad" "EstadoActividad" NOT NULL DEFAULT 'DESCONECTADO',

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("IdUsuario")
);

-- CreateTable
CREATE TABLE "Interes" (
    "IdInteres" SERIAL NOT NULL,
    "signoZodiacal" "SignoZodiacal",
    "queBusca" TEXT,
    "ubicacion" TEXT,
    "ciudad" TEXT,
    "pais" TEXT,
    "hobby" TEXT,
    "dedicacion" TEXT,
    "UsuarioFK" INTEGER NOT NULL,

    CONSTRAINT "Interes_pkey" PRIMARY KEY ("IdInteres")
);

-- CreateTable
CREATE TABLE "Foto" (
    "IdFoto" SERIAL NOT NULL,
    "urlFoto" TEXT NOT NULL,
    "UsuarioFK" INTEGER NOT NULL,

    CONSTRAINT "Foto_pkey" PRIMARY KEY ("IdFoto")
);

-- CreateTable
CREATE TABLE "Ubicacion" (
    "IdUbicacion" SERIAL NOT NULL,
    "ubicacion" TEXT,
    "ciudad" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "UsuarioFK" INTEGER NOT NULL,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("IdUbicacion")
);

-- CreateTable
CREATE TABLE "Musica" (
    "IdMusica" SERIAL NOT NULL,
    "nombreCancion" TEXT,
    "tipoMusica" TEXT,
    "UsuarioFK" INTEGER NOT NULL,

    CONSTRAINT "Musica_pkey" PRIMARY KEY ("IdMusica")
);

-- CreateTable
CREATE TABLE "PlanSuscripcion" (
    "IdPlanSuscripcion" SERIAL NOT NULL,
    "tipoPlan" "TipoPlan" NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "contenido" TEXT,
    "mensajesIlimitados" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PlanSuscripcion_pkey" PRIMARY KEY ("IdPlanSuscripcion")
);

-- CreateTable
CREATE TABLE "SuscripcionUsuario" (
    "IdSuscripcionUsuario" SERIAL NOT NULL,
    "UsuarioFK" INTEGER NOT NULL,
    "PlanSuscripcionFK" INTEGER NOT NULL,

    CONSTRAINT "SuscripcionUsuario_pkey" PRIMARY KEY ("IdSuscripcionUsuario")
);

-- CreateTable
CREATE TABLE "Pago" (
    "IdPago" SERIAL NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "fechaPago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "SuscripcionUsuarioFK" INTEGER NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("IdPago")
);

-- CreateTable
CREATE TABLE "Ventaja" (
    "IdVentaja" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "PlanSuscripcionFK" INTEGER NOT NULL,

    CONSTRAINT "Ventaja_pkey" PRIMARY KEY ("IdVentaja")
);

-- CreateTable
CREATE TABLE "Restriccion" (
    "IdRestriccion" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "PlanSuscripcionFK" INTEGER,

    CONSTRAINT "Restriccion_pkey" PRIMARY KEY ("IdRestriccion")
);

-- CreateTable
CREATE TABLE "CondicionComunicacion" (
    "IdCondicionComunicacion" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "CondicionComunicacion_pkey" PRIMARY KEY ("IdCondicionComunicacion")
);

-- CreateTable
CREATE TABLE "Interaccion" (
    "IdInteraccion" SERIAL NOT NULL,
    "tipoInteraccion" "TipoInteraccion" NOT NULL,
    "fechaInteraccion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UsuarioEmisorFK" INTEGER NOT NULL,
    "UsuarioReceptorFK" INTEGER NOT NULL,

    CONSTRAINT "Interaccion_pkey" PRIMARY KEY ("IdInteraccion")
);

-- CreateTable
CREATE TABLE "Reporte" (
    "IdReporte" SERIAL NOT NULL,
    "motivo" TEXT NOT NULL,
    "fechaReporte" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UsuarioReportanteFK" INTEGER NOT NULL,
    "UsuarioReportadoFK" INTEGER NOT NULL,

    CONSTRAINT "Reporte_pkey" PRIMARY KEY ("IdReporte")
);

-- CreateTable
CREATE TABLE "Donacion" (
    "IdDonacion" SERIAL NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "fechaDonacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UsuarioDonanteFK" INTEGER NOT NULL,
    "UsuarioReceptorFK" INTEGER NOT NULL,
    "TransmisionFK" INTEGER,

    CONSTRAINT "Donacion_pkey" PRIMARY KEY ("IdDonacion")
);

-- CreateTable
CREATE TABLE "Match" (
    "IdMatch" SERIAL NOT NULL,
    "fechaMatch" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UsuarioUnoFK" INTEGER NOT NULL,
    "UsuarioDosFK" INTEGER NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("IdMatch")
);

-- CreateTable
CREATE TABLE "Chat" (
    "IdChat" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "MatchFK" INTEGER NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("IdChat")
);

-- CreateTable
CREATE TABLE "Mensaje" (
    "IdMensaje" SERIAL NOT NULL,
    "contenido" TEXT NOT NULL,
    "fechaEnvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ChatFK" INTEGER NOT NULL,
    "UsuarioEmisorFK" INTEGER NOT NULL,

    CONSTRAINT "Mensaje_pkey" PRIMARY KEY ("IdMensaje")
);

-- CreateTable
CREATE TABLE "Transmision" (
    "IdTransmision" SERIAL NOT NULL,
    "estado" "EstadoTransmision" NOT NULL DEFAULT 'LIVE',
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMP(3),
    "UsuarioFK" INTEGER NOT NULL,

    CONSTRAINT "Transmision_pkey" PRIMARY KEY ("IdTransmision")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_numeroTelefono_key" ON "Usuario"("numeroTelefono");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Interes_UsuarioFK_key" ON "Interes"("UsuarioFK");

-- CreateIndex
CREATE UNIQUE INDEX "PlanSuscripcion_tipoPlan_key" ON "PlanSuscripcion"("tipoPlan");

-- CreateIndex
CREATE UNIQUE INDEX "SuscripcionUsuario_UsuarioFK_key" ON "SuscripcionUsuario"("UsuarioFK");

-- CreateIndex
CREATE UNIQUE INDEX "Interaccion_UsuarioEmisorFK_UsuarioReceptorFK_key" ON "Interaccion"("UsuarioEmisorFK", "UsuarioReceptorFK");

-- CreateIndex
CREATE UNIQUE INDEX "Match_UsuarioUnoFK_UsuarioDosFK_key" ON "Match"("UsuarioUnoFK", "UsuarioDosFK");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_MatchFK_key" ON "Chat"("MatchFK");

-- AddForeignKey
ALTER TABLE "Interes" ADD CONSTRAINT "Interes_UsuarioFK_fkey" FOREIGN KEY ("UsuarioFK") REFERENCES "Usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Foto" ADD CONSTRAINT "Foto_UsuarioFK_fkey" FOREIGN KEY ("UsuarioFK") REFERENCES "Usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ubicacion" ADD CONSTRAINT "Ubicacion_UsuarioFK_fkey" FOREIGN KEY ("UsuarioFK") REFERENCES "Usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Musica" ADD CONSTRAINT "Musica_UsuarioFK_fkey" FOREIGN KEY ("UsuarioFK") REFERENCES "Usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuscripcionUsuario" ADD CONSTRAINT "SuscripcionUsuario_UsuarioFK_fkey" FOREIGN KEY ("UsuarioFK") REFERENCES "Usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuscripcionUsuario" ADD CONSTRAINT "SuscripcionUsuario_PlanSuscripcionFK_fkey" FOREIGN KEY ("PlanSuscripcionFK") REFERENCES "PlanSuscripcion"("IdPlanSuscripcion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_SuscripcionUsuarioFK_fkey" FOREIGN KEY ("SuscripcionUsuarioFK") REFERENCES "SuscripcionUsuario"("IdSuscripcionUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ventaja" ADD CONSTRAINT "Ventaja_PlanSuscripcionFK_fkey" FOREIGN KEY ("PlanSuscripcionFK") REFERENCES "PlanSuscripcion"("IdPlanSuscripcion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restriccion" ADD CONSTRAINT "Restriccion_PlanSuscripcionFK_fkey" FOREIGN KEY ("PlanSuscripcionFK") REFERENCES "PlanSuscripcion"("IdPlanSuscripcion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaccion" ADD CONSTRAINT "Interaccion_UsuarioEmisorFK_fkey" FOREIGN KEY ("UsuarioEmisorFK") REFERENCES "Usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaccion" ADD CONSTRAINT "Interaccion_UsuarioReceptorFK_fkey" FOREIGN KEY ("UsuarioReceptorFK") REFERENCES "Usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_UsuarioReportanteFK_fkey" FOREIGN KEY ("UsuarioReportanteFK") REFERENCES "Usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_UsuarioReportadoFK_fkey" FOREIGN KEY ("UsuarioReportadoFK") REFERENCES "Usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donacion" ADD CONSTRAINT "Donacion_UsuarioDonanteFK_fkey" FOREIGN KEY ("UsuarioDonanteFK") REFERENCES "Usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donacion" ADD CONSTRAINT "Donacion_UsuarioReceptorFK_fkey" FOREIGN KEY ("UsuarioReceptorFK") REFERENCES "Usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donacion" ADD CONSTRAINT "Donacion_TransmisionFK_fkey" FOREIGN KEY ("TransmisionFK") REFERENCES "Transmision"("IdTransmision") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_UsuarioUnoFK_fkey" FOREIGN KEY ("UsuarioUnoFK") REFERENCES "Usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_UsuarioDosFK_fkey" FOREIGN KEY ("UsuarioDosFK") REFERENCES "Usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_MatchFK_fkey" FOREIGN KEY ("MatchFK") REFERENCES "Match"("IdMatch") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_ChatFK_fkey" FOREIGN KEY ("ChatFK") REFERENCES "Chat"("IdChat") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_UsuarioEmisorFK_fkey" FOREIGN KEY ("UsuarioEmisorFK") REFERENCES "Usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transmision" ADD CONSTRAINT "Transmision_UsuarioFK_fkey" FOREIGN KEY ("UsuarioFK") REFERENCES "Usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;
