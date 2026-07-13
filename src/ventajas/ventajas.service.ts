/* src/ventajas/ventajas.service.ts: */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaSuscripcionesService } from '../prisma-suscripciones/prisma-suscripciones.service';
import { CreateVentajaDto } from './dto/create-ventaja.dto';
import { UpdateVentajaDto } from './dto/update-ventaja.dto';

@Injectable()
export class VentajasService {
  constructor(
    private readonly prismaSuscripciones: PrismaSuscripcionesService,
  ) { }

  async create(createVentajaDto: CreateVentajaDto) {
    await this.verificarPlanSuscripcion(
      createVentajaDto.PlanSuscripcionFK,
    );

    return this.prismaSuscripciones.ventaja.create({
      data: createVentajaDto,
    });
  }

  findAll() {
    return this.prismaSuscripciones.ventaja.findMany();
  }

  async findByPlan(idPlanSuscripcion: number) {
    await this.verificarPlanSuscripcion(idPlanSuscripcion);

    return this.prismaSuscripciones.ventaja.findMany({
      where: {
        PlanSuscripcionFK: idPlanSuscripcion,
      },
    });
  }

  async findOne(id: number) {
    const ventaja =
      await this.prismaSuscripciones.ventaja.findUnique({
        where: {
          IdVentaja: id,
        },
      });

    if (!ventaja) {
      throw new NotFoundException(
        `No existe una ventaja con el ID ${id}.`,
      );
    }

    return ventaja;
  }

  async update(id: number, updateVentajaDto: UpdateVentajaDto) {
    await this.findOne(id);

    if (updateVentajaDto.PlanSuscripcionFK !== undefined) {
      await this.verificarPlanSuscripcion(
        updateVentajaDto.PlanSuscripcionFK,
      );
    }

    return this.prismaSuscripciones.ventaja.update({
      where: {
        IdVentaja: id,
      },
      data: updateVentajaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prismaSuscripciones.ventaja.delete({
      where: {
        IdVentaja: id,
      },
    });
  }

  private async verificarPlanSuscripcion(
    idPlanSuscripcion: number,
  ): Promise<void> {
    const planSuscripcion =
      await this.prismaSuscripciones.planSuscripcion.findUnique({
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