/* src/planes-suscripcion/planes-suscripcion.service.ts: */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanSuscripcionDto } from './dto/create-plan-suscripcion.dto';
import { UpdatePlanSuscripcionDto } from './dto/update-plan-suscripcion.dto';

@Injectable()
export class PlanesSuscripcionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPlanSuscripcionDto: CreatePlanSuscripcionDto) {
    const planExistente = await this.prisma.planSuscripcion.findUnique({
      where: {
        tipoPlan: createPlanSuscripcionDto.tipoPlan,
      },
    });

    if (planExistente) {
      throw new ConflictException(
        `El plan ${createPlanSuscripcionDto.tipoPlan} ya está registrado.`,
      );
    }

    return this.prisma.planSuscripcion.create({
      data: createPlanSuscripcionDto,
    });
  }

  findAll() {
    return this.prisma.planSuscripcion.findMany({
      include: {
        ventajas: true,
        restricciones: true,
      },
    });
  }

  async findOne(id: number) {
    const planSuscripcion =
      await this.prisma.planSuscripcion.findUnique({
        where: {
          IdPlanSuscripcion: id,
        },
        include: {
          ventajas: true,
          restricciones: true,
        },
      });

    if (!planSuscripcion) {
      throw new NotFoundException(
        `No existe un plan de suscripción con el ID ${id}.`,
      );
    }

    return planSuscripcion;
  }

  async update(
    id: number,
    updatePlanSuscripcionDto: UpdatePlanSuscripcionDto,
  ) {
    await this.findOne(id);

    if (updatePlanSuscripcionDto.tipoPlan !== undefined) {
      const planConMismoTipo =
        await this.prisma.planSuscripcion.findFirst({
          where: {
            tipoPlan: updatePlanSuscripcionDto.tipoPlan,
            NOT: {
              IdPlanSuscripcion: id,
            },
          },
        });

      if (planConMismoTipo) {
        throw new ConflictException(
          `El plan ${updatePlanSuscripcionDto.tipoPlan} ya está registrado.`,
        );
      }
    }

    return this.prisma.planSuscripcion.update({
      where: {
        IdPlanSuscripcion: id,
      },
      data: updatePlanSuscripcionDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.planSuscripcion.delete({
      where: {
        IdPlanSuscripcion: id,
      },
    });
  }
}