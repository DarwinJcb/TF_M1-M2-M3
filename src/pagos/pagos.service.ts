/* src/pagos/pagos.service.ts: */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaSuscripcionesService } from '../prisma-suscripciones/prisma-suscripciones.service';
import { PrismaUsuariosService } from '../prisma-usuarios/prisma-usuarios.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@Injectable()
export class PagosService {
  constructor(
    private readonly prismaSuscripciones: PrismaSuscripcionesService,
    private readonly prismaUsuarios: PrismaUsuariosService,
  ) {}

  async create(createPagoDto: CreatePagoDto) {
    const suscripcion = await this.obtenerSuscripcion(
      createPagoDto.SuscripcionFK,
    );

    const usuario = await this.obtenerUsuario(suscripcion.UsuarioFK);

    const pago = await this.prismaSuscripciones.pago.create({
      data: createPagoDto,
      include: {
        suscripcion: {
          include: {
            planSuscripcion: true,
          },
        },
      },
    });

    return {
      ...pago,
      suscripcion: {
        ...pago.suscripcion,
        usuario,
      },
    };
  }

  async findAll() {
    const pagos = await this.prismaSuscripciones.pago.findMany({
      include: {
        suscripcion: {
          include: {
            planSuscripcion: true,
          },
        },
      },
    });

    if (pagos.length === 0) {
      return [];
    }

    const identificadoresUsuarios = [
      ...new Set(pagos.map((pago) => pago.suscripcion.UsuarioFK)),
    ];

    const usuarios = await this.prismaUsuarios.usuario.findMany({
      where: {
        IdUsuario: {
          in: identificadoresUsuarios,
        },
      },
    });

    const usuariosPorId = new Map(
      usuarios.map((usuario) => [usuario.IdUsuario, usuario]),
    );

    return pagos.map((pago) => ({
      ...pago,
      suscripcion: {
        ...pago.suscripcion,
        usuario: usuariosPorId.get(pago.suscripcion.UsuarioFK) ?? null,
      },
    }));
  }

  async findBySuscripcion(idSuscripcion: number) {
    const suscripcion = await this.obtenerSuscripcion(idSuscripcion);

    const usuario = await this.obtenerUsuario(suscripcion.UsuarioFK);

    const pagos = await this.prismaSuscripciones.pago.findMany({
      where: {
        SuscripcionFK: idSuscripcion,
      },
      include: {
        suscripcion: {
          include: {
            planSuscripcion: true,
          },
        },
      },
    });

    return pagos.map((pago) => ({
      ...pago,
      suscripcion: {
        ...pago.suscripcion,
        usuario,
      },
    }));
  }

  async findOne(id: number) {
    const pago = await this.prismaSuscripciones.pago.findUnique({
      where: {
        IdPago: id,
      },
      include: {
        suscripcion: {
          include: {
            planSuscripcion: true,
          },
        },
      },
    });

    if (!pago) {
      throw new NotFoundException(`No existe un pago con el ID ${id}.`);
    }

    const usuario = await this.obtenerUsuario(pago.suscripcion.UsuarioFK);

    return {
      ...pago,
      suscripcion: {
        ...pago.suscripcion,
        usuario,
      },
    };
  }

  async update(id: number, updatePagoDto: UpdatePagoDto) {
    const pagoActual = await this.obtenerPago(id);

    const idSuscripcion =
      updatePagoDto.SuscripcionFK ?? pagoActual.SuscripcionFK;

    const suscripcion = await this.obtenerSuscripcion(idSuscripcion);

    const usuario = await this.obtenerUsuario(suscripcion.UsuarioFK);

    const pagoActualizado = await this.prismaSuscripciones.pago.update({
      where: {
        IdPago: id,
      },
      data: updatePagoDto,
      include: {
        suscripcion: {
          include: {
            planSuscripcion: true,
          },
        },
      },
    });

    return {
      ...pagoActualizado,
      suscripcion: {
        ...pagoActualizado.suscripcion,
        usuario,
      },
    };
  }

  async remove(id: number) {
    await this.obtenerPago(id);

    return this.prismaSuscripciones.pago.delete({
      where: {
        IdPago: id,
      },
    });
  }

  private async obtenerPago(idPago: number) {
    const pago = await this.prismaSuscripciones.pago.findUnique({
      where: {
        IdPago: idPago,
      },
    });

    if (!pago) {
      throw new NotFoundException(`No existe un pago con el ID ${idPago}.`);
    }

    return pago;
  }

  private async obtenerSuscripcion(idSuscripcion: number) {
    const suscripcion = await this.prismaSuscripciones.suscripcion.findUnique({
      where: {
        IdSuscripcion: idSuscripcion,
      },
      include: {
        planSuscripcion: true,
      },
    });

    if (!suscripcion) {
      throw new NotFoundException(
        `No existe una suscripción con el ID ${idSuscripcion}.`,
      );
    }

    return suscripcion;
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
}
