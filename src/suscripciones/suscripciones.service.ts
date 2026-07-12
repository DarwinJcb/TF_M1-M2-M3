/* src/suscripciones/suscripciones.service.ts: */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';
import { UpdateSuscripcionDto } from './dto/update-suscripcion.dto';

@Injectable()
export class SuscripcionesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSuscripcionDto: CreateSuscripcionDto) {
    await this.verificarUsuario(createSuscripcionDto.UsuarioFK);

    await this.verificarPlanSuscripcion(createSuscripcionDto.PlanSuscripcionFK);

    const suscripcionExistente = await this.prisma.suscripcion.findUnique({
      where: {
        UsuarioFK: createSuscripcionDto.UsuarioFK,
      },
    });

    if (suscripcionExistente) {
      throw new ConflictException(
        `El usuario con el ID ${createSuscripcionDto.UsuarioFK} ya tiene una suscripción.`,
      );
    }

    return this.prisma.suscripcion.create({
      data: createSuscripcionDto,
      include: {
        planSuscripcion: true,
      },
    });
  }

  findAll() {
    return this.prisma.suscripcion.findMany({
      include: {
        usuario: true,
        planSuscripcion: true,
        pagos: true,
      },
    });
  }

  async findByUsuario(idUsuario: number) {
    await this.verificarUsuario(idUsuario);

    const suscripcion = await this.prisma.suscripcion.findUnique({
      where: {
        UsuarioFK: idUsuario,
      },
      include: {
        planSuscripcion: true,
        pagos: true,
      },
    });

    if (!suscripcion) {
      throw new NotFoundException(
        `El usuario con el ID ${idUsuario} no tiene una suscripción.`,
      );
    }

    return suscripcion;
  }

  async findOne(id: number) {
    const suscripcion = await this.prisma.suscripcion.findUnique({
      where: {
        IdSuscripcion: id,
      },
      include: {
        usuario: true,
        planSuscripcion: true,
        pagos: true,
      },
    });

    if (!suscripcion) {
      throw new NotFoundException(`No existe una suscripción con el ID ${id}.`);
    }

    return suscripcion;
  }

  async update(id: number, updateSuscripcionDto: UpdateSuscripcionDto) {
    await this.findOne(id);

    if (updateSuscripcionDto.UsuarioFK !== undefined) {
      await this.verificarUsuario(updateSuscripcionDto.UsuarioFK);

      const suscripcionDelUsuario = await this.prisma.suscripcion.findUnique({
        where: {
          UsuarioFK: updateSuscripcionDto.UsuarioFK,
        },
      });

      if (suscripcionDelUsuario && suscripcionDelUsuario.IdSuscripcion !== id) {
        throw new ConflictException(
          `El usuario con el ID ${updateSuscripcionDto.UsuarioFK} ya tiene una suscripción.`,
        );
      }
    }

    if (updateSuscripcionDto.PlanSuscripcionFK !== undefined) {
      await this.verificarPlanSuscripcion(
        updateSuscripcionDto.PlanSuscripcionFK,
      );
    }

    return this.prisma.suscripcion.update({
      where: {
        IdSuscripcion: id,
      },
      data: updateSuscripcionDto,
      include: {
        usuario: true,
        planSuscripcion: true,
        pagos: true,
      },
    });
  }

  async remove(id: number) {
    const suscripcion = await this.findOne(id);

    if (suscripcion.pagos.length > 0) {
      throw new ConflictException(
        'No se puede eliminar la suscripción porque tiene pagos asociados.',
      );
    }

    return this.prisma.suscripcion.delete({
      where: {
        IdSuscripcion: id,
      },
    });
  }

  private async verificarUsuario(idUsuario: number): Promise<void> {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        IdUsuario: idUsuario,
      },
      select: {
        IdUsuario: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(
        `No existe un usuario con el ID ${idUsuario}.`,
      );
    }
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
