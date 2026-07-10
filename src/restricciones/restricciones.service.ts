/* src/restricciones/restricciones.service.ts: */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRestriccionDto } from './dto/create-restriccion.dto';
import { UpdateRestriccionDto } from './dto/update-restriccion.dto';

@Injectable()
export class RestriccionesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRestriccionDto: CreateRestriccionDto) {
    const idPlanSuscripcion = createRestriccionDto.PlanSuscripcionFK;

    if (typeof idPlanSuscripcion === 'number') {
      await this.verificarPlanSuscripcion(idPlanSuscripcion);
    }

    return this.prisma.restriccion.create({
      data: createRestriccionDto,
    });
  }

  findAll() {
    return this.prisma.restriccion.findMany();
  }

  findGenerales() {
    return this.prisma.restriccion.findMany({
      where: {
        PlanSuscripcionFK: null,
      },
    });
  }

  async findByPlan(idPlanSuscripcion: number) {
    await this.verificarPlanSuscripcion(idPlanSuscripcion);

    return this.prisma.restriccion.findMany({
      where: {
        PlanSuscripcionFK: idPlanSuscripcion,
      },
    });
  }

  async findOne(id: number) {
    const restriccion = await this.prisma.restriccion.findUnique({
      where: {
        IdRestriccion: id,
      },
    });

    if (!restriccion) {
      throw new NotFoundException(`No existe una restricción con el ID ${id}.`);
    }

    return restriccion;
  }

  async update(id: number, updateRestriccionDto: UpdateRestriccionDto) {
    await this.findOne(id);

    const idPlanSuscripcion = updateRestriccionDto.PlanSuscripcionFK;

    if (typeof idPlanSuscripcion === 'number') {
      await this.verificarPlanSuscripcion(idPlanSuscripcion);
    }

    return this.prisma.restriccion.update({
      where: {
        IdRestriccion: id,
      },
      data: updateRestriccionDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.restriccion.delete({
      where: {
        IdRestriccion: id,
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
