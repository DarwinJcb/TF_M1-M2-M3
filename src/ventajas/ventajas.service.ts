/* src/ventajas/ventajas.service.ts: */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVentajaDto } from './dto/create-ventaja.dto';
import { UpdateVentajaDto } from './dto/update-ventaja.dto';

@Injectable()
export class VentajasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVentajaDto: CreateVentajaDto) {
    await this.verificarPlanSuscripcion(createVentajaDto.PlanSuscripcionFK);

    return this.prisma.ventaja.create({
      data: createVentajaDto,
    });
  }

  findAll() {
    return this.prisma.ventaja.findMany();
  }

  async findByPlan(idPlanSuscripcion: number) {
    await this.verificarPlanSuscripcion(idPlanSuscripcion);

    return this.prisma.ventaja.findMany({
      where: {
        PlanSuscripcionFK: idPlanSuscripcion,
      },
    });
  }

  async findOne(id: number) {
    const ventaja = await this.prisma.ventaja.findUnique({
      where: {
        IdVentaja: id,
      },
    });

    if (!ventaja) {
      throw new NotFoundException(`No existe una ventaja con el ID ${id}.`);
    }

    return ventaja;
  }

  async update(id: number, updateVentajaDto: UpdateVentajaDto) {
    await this.findOne(id);

    if (updateVentajaDto.PlanSuscripcionFK !== undefined) {
      await this.verificarPlanSuscripcion(updateVentajaDto.PlanSuscripcionFK);
    }

    return this.prisma.ventaja.update({
      where: {
        IdVentaja: id,
      },
      data: updateVentajaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.ventaja.delete({
      where: {
        IdVentaja: id,
      },
    });
  }

  private async verificarPlanSuscripcion(
    idPlanSuscripcion: number,
  ): Promise<void> {
    const planSuscripcion = await this.prisma.planSuscripcion.findUnique({
      where: {
        IdPlanSuscripcion: idPlanSuscripcion,
      },
      select: {
        IdPlanSuscripcion: true,
      },
    });

    if (!planSuscripcion) {
      throw new NotFoundException(
        `No existe un plan de suscripción con el ID ${idPlanSuscripcion}.`,
      );
    }
  }
}
