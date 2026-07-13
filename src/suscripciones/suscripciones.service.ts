/* src/suscripciones/suscripciones.service.ts: */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaSuscripcionesService } from '../prisma-suscripciones/prisma-suscripciones.service';
import { PrismaUsuariosService } from '../prisma-usuarios/prisma-usuarios.service';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';
import { UpdateSuscripcionDto } from './dto/update-suscripcion.dto';

@Injectable()
export class SuscripcionesService {
  constructor(
    private readonly prismaSuscripciones: PrismaSuscripcionesService,
    private readonly prismaUsuarios: PrismaUsuariosService,
  ) { }

  async create(createSuscripcionDto: CreateSuscripcionDto) {
    const usuario = await this.obtenerUsuario(
      createSuscripcionDto.UsuarioFK,
    );

    await this.verificarPlanSuscripcion(
      createSuscripcionDto.PlanSuscripcionFK,
    );

    const suscripcionExistente =
      await this.prismaSuscripciones.suscripcion.findUnique({
        where: {
          UsuarioFK: createSuscripcionDto.UsuarioFK,
        },
      });

    if (suscripcionExistente) {
      throw new ConflictException(
        `El usuario con el ID ${createSuscripcionDto.UsuarioFK} ya tiene una suscripción.`,
      );
    }

    const suscripcion =
      await this.prismaSuscripciones.suscripcion.create({
        data: createSuscripcionDto,
        include: {
          planSuscripcion: true,
          pagos: true,
        },
      });

    return {
      ...suscripcion,
      usuario,
    };
  }

  async findAll() {
    const suscripciones =
      await this.prismaSuscripciones.suscripcion.findMany({
        include: {
          planSuscripcion: true,
          pagos: true,
        },
      });

    if (suscripciones.length === 0) {
      return [];
    }

    const identificadoresUsuarios = suscripciones.map(
      (suscripcion) => suscripcion.UsuarioFK,
    );

    const usuarios = await this.prismaUsuarios.usuario.findMany({
      where: {
        IdUsuario: {
          in: identificadoresUsuarios,
        },
      },
    });

    const usuariosPorId = new Map(
      usuarios.map((usuario) => [
        usuario.IdUsuario,
        usuario,
      ]),
    );

    return suscripciones.map((suscripcion) => ({
      ...suscripcion,
      usuario:
        usuariosPorId.get(suscripcion.UsuarioFK) ?? null,
    }));
  }

  async findByUsuario(idUsuario: number) {
    const usuario = await this.obtenerUsuario(idUsuario);

    const suscripcion =
      await this.prismaSuscripciones.suscripcion.findUnique({
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

    return {
      ...suscripcion,
      usuario,
    };
  }

  async findOne(id: number) {
    const suscripcion =
      await this.prismaSuscripciones.suscripcion.findUnique({
        where: {
          IdSuscripcion: id,
        },
        include: {
          planSuscripcion: true,
          pagos: true,
        },
      });

    if (!suscripcion) {
      throw new NotFoundException(
        `No existe una suscripción con el ID ${id}.`,
      );
    }

    const usuario = await this.obtenerUsuario(
      suscripcion.UsuarioFK,
    );

    return {
      ...suscripcion,
      usuario,
    };
  }

  async update(
    id: number,
    updateSuscripcionDto: UpdateSuscripcionDto,
  ) {
    const suscripcionActual =
      await this.prismaSuscripciones.suscripcion.findUnique({
        where: {
          IdSuscripcion: id,
        },
        select: {
          IdSuscripcion: true,
        },
      });

    if (!suscripcionActual) {
      throw new NotFoundException(
        `No existe una suscripción con el ID ${id}.`,
      );
    }

    if (updateSuscripcionDto.UsuarioFK !== undefined) {
      await this.obtenerUsuario(
        updateSuscripcionDto.UsuarioFK,
      );

      const suscripcionDelUsuario =
        await this.prismaSuscripciones.suscripcion.findUnique({
          where: {
            UsuarioFK: updateSuscripcionDto.UsuarioFK,
          },
        });

      if (
        suscripcionDelUsuario &&
        suscripcionDelUsuario.IdSuscripcion !== id
      ) {
        throw new ConflictException(
          `El usuario con el ID ${updateSuscripcionDto.UsuarioFK} ya tiene una suscripción.`,
        );
      }
    }

    if (
      updateSuscripcionDto.PlanSuscripcionFK !== undefined
    ) {
      await this.verificarPlanSuscripcion(
        updateSuscripcionDto.PlanSuscripcionFK,
      );
    }

    const suscripcionActualizada =
      await this.prismaSuscripciones.suscripcion.update({
        where: {
          IdSuscripcion: id,
        },
        data: updateSuscripcionDto,
        include: {
          planSuscripcion: true,
          pagos: true,
        },
      });

    const usuario = await this.obtenerUsuario(
      suscripcionActualizada.UsuarioFK,
    );

    return {
      ...suscripcionActualizada,
      usuario,
    };
  }

  async remove(id: number) {
    const suscripcion =
      await this.prismaSuscripciones.suscripcion.findUnique({
        where: {
          IdSuscripcion: id,
        },
        include: {
          pagos: true,
        },
      });

    if (!suscripcion) {
      throw new NotFoundException(
        `No existe una suscripción con el ID ${id}.`,
      );
    }

    if (suscripcion.pagos.length > 0) {
      throw new ConflictException(
        'No se puede eliminar la suscripción porque tiene pagos asociados.',
      );
    }

    return this.prismaSuscripciones.suscripcion.delete({
      where: {
        IdSuscripcion: id,
      },
    });
  }

  private async obtenerUsuario(idUsuario: number) {
    const usuario = await this.prismaUsuarios.usuario.findUnique({
      where: {
        IdUsuario: idUsuario,
      },
    });

    if (!usuario) {
      throw new NotFoundException(
        `No existe un usuario con el ID ${idUsuario}.`,
      );
    }

    return usuario;
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