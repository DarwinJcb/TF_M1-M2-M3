-- CreateEnum
CREATE TYPE "TipoInteraccion" AS ENUM ('LIKE', 'DISLIKE', 'EVITAR', 'SUPERLIKE');

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

-- CreateIndex
CREATE UNIQUE INDEX "Interaccion_UsuarioEmisorFK_UsuarioReceptorFK_key" ON "Interaccion"("UsuarioEmisorFK", "UsuarioReceptorFK");

-- CreateIndex
CREATE UNIQUE INDEX "Match_UsuarioUnoFK_UsuarioDosFK_key" ON "Match"("UsuarioUnoFK", "UsuarioDosFK");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_MatchFK_key" ON "Chat"("MatchFK");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_MatchFK_fkey" FOREIGN KEY ("MatchFK") REFERENCES "Match"("IdMatch") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_ChatFK_fkey" FOREIGN KEY ("ChatFK") REFERENCES "Chat"("IdChat") ON DELETE RESTRICT ON UPDATE CASCADE;
