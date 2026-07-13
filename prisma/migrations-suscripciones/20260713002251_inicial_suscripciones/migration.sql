-- CreateEnum
CREATE TYPE "TipoPlan" AS ENUM ('BRONZE', 'GOLD', 'PREMIUM', 'PLATINUM');

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
CREATE TABLE "Suscripcion" (
    "IdSuscripcion" SERIAL NOT NULL,
    "UsuarioFK" INTEGER NOT NULL,
    "PlanSuscripcionFK" INTEGER NOT NULL,

    CONSTRAINT "Suscripcion_pkey" PRIMARY KEY ("IdSuscripcion")
);

-- CreateTable
CREATE TABLE "Pago" (
    "IdPago" SERIAL NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "fechaPago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "SuscripcionFK" INTEGER NOT NULL,

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

-- CreateIndex
CREATE UNIQUE INDEX "PlanSuscripcion_tipoPlan_key" ON "PlanSuscripcion"("tipoPlan");

-- CreateIndex
CREATE UNIQUE INDEX "Suscripcion_UsuarioFK_key" ON "Suscripcion"("UsuarioFK");

-- AddForeignKey
ALTER TABLE "Suscripcion" ADD CONSTRAINT "Suscripcion_PlanSuscripcionFK_fkey" FOREIGN KEY ("PlanSuscripcionFK") REFERENCES "PlanSuscripcion"("IdPlanSuscripcion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_SuscripcionFK_fkey" FOREIGN KEY ("SuscripcionFK") REFERENCES "Suscripcion"("IdSuscripcion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ventaja" ADD CONSTRAINT "Ventaja_PlanSuscripcionFK_fkey" FOREIGN KEY ("PlanSuscripcionFK") REFERENCES "PlanSuscripcion"("IdPlanSuscripcion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restriccion" ADD CONSTRAINT "Restriccion_PlanSuscripcionFK_fkey" FOREIGN KEY ("PlanSuscripcionFK") REFERENCES "PlanSuscripcion"("IdPlanSuscripcion") ON DELETE SET NULL ON UPDATE CASCADE;
