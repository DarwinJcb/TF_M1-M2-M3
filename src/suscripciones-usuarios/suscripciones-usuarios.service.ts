/* src/suscripciones-usuarios/suscripciones-usuarios.service.ts: */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSuscripcionUsuarioDto } from './dto/create-suscripcion-usuario.dto';
import { UpdateSuscripcionUsuarioDto } from './dto/update-suscripcion-usuario.dto';

@Injectable()
export class SuscripcionesUsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSuscripcionUsuarioDto: CreateSuscripcionUsuarioDto) {
    await this.verificarUsuario(createSuscripcionUsuarioDto.UsuarioFK);

    await this.verificarPlanSuscripcion(
      createSuscripcionUsuarioDto.PlanSuscripcionFK,
    );

    const suscripcionExistente =
      await this.prisma.suscripcionUsuario.findUnique({
        where: {
          UsuarioFK: createSuscripcionUsuarioDto.UsuarioFK,
        },
      });

    if (suscripcionExistente) {
      throw new ConflictException(
        `El usuario con el ID ${createSuscripcionUsuarioDto.UsuarioFK} ya tiene una suscripción.`,
      );
    }

    return this.prisma.suscripcionUsuario.create({
      data: createSuscripcionUsuarioDto,
      include: {
        planSuscripcion: true,
      },
    });
  }

  findAll() {
    return this.prisma.suscripcionUsuario.findMany({
      include: {
        usuario: true,
        planSuscripcion: true,
        pagos: true,
      },
    });
  }

  async findByUsuario(idUsuario: number) {
    await this.verificarUsuario(idUsuario);

    const suscripcion = await this.prisma.suscripcionUsuario.findUnique({
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
    const suscripcion = await this.prisma.suscripcionUsuario.findUnique({
      where: {
        IdSuscripcionUsuario: id,
      },
      include: {
        usuario: true,
        planSuscripcion: true,
        pagos: true,
      },
    });

    if (!suscripcion) {
      throw new NotFoundException(
        `No existe una suscripción de usuario con el ID ${id}.`,
      );
    }

    return suscripcion;
  }

  async update(
    id: number,
    updateSuscripcionUsuarioDto: UpdateSuscripcionUsuarioDto,
  ) {
    await this.findOne(id);

    if (updateSuscripcionUsuarioDto.UsuarioFK !== undefined) {
      await this.verificarUsuario(updateSuscripcionUsuarioDto.UsuarioFK);

      const suscripcionDelUsuario =
        await this.prisma.suscripcionUsuario.findUnique({
          where: {
            UsuarioFK: updateSuscripcionUsuarioDto.UsuarioFK,
          },
        });

      if (
        suscripcionDelUsuario &&
        suscripcionDelUsuario.IdSuscripcionUsuario !== id
      ) {
        throw new ConflictException(
          `El usuario con el ID ${updateSuscripcionUsuarioDto.UsuarioFK} ya tiene una suscripción.`,
        );
      }
    }

    if (updateSuscripcionUsuarioDto.PlanSuscripcionFK !== undefined) {
      await this.verificarPlanSuscripcion(
        updateSuscripcionUsuarioDto.PlanSuscripcionFK,
      );
    }

    return this.prisma.suscripcionUsuario.update({
      where: {
        IdSuscripcionUsuario: id,
      },
      data: updateSuscripcionUsuarioDto,
      include: {
        planSuscripcion: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.suscripcionUsuario.delete({
      where: {
        IdSuscripcionUsuario: id,
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
