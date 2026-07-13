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
  ) { }

  async create(createPagoDto: CreatePagoDto) {
    await this.verificarSuscripcion(createPagoDto.SuscripcionFK);

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

    const usuario = await this.prismaUsuarios.usuario.findUnique({
      where: {
        IdUsuario: pago.suscripcion.UsuarioFK,
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
      ...new Set(
        pagos.map((pago) => pago.suscripcion.UsuarioFK),
      ),
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
        usuario:
          usuariosPorId.get(pago.suscripcion.UsuarioFK) ?? null,
      },
    }));
  }

  async findBySuscripcion(idSuscripcion: number) {
    await this.verificarSuscripcion(idSuscripcion);

    return this.prismaSuscripciones.pago.findMany({
      where: {
        SuscripcionFK: idSuscripcion,
      },
    });
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

    const usuario = await this.prismaUsuarios.usuario.findUnique({
      where: {
        IdUsuario: pago.suscripcion.UsuarioFK,
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

  async update(id: number, updatePagoDto: UpdatePagoDto) {
    await this.verificarPago(id);

    if (updatePagoDto.SuscripcionFK !== undefined) {
      await this.verificarSuscripcion(
        updatePagoDto.SuscripcionFK,
      );
    }

    return this.prismaSuscripciones.pago.update({
      where: {
        IdPago: id,
      },
      data: updatePagoDto,
    });
  }

  async remove(id: number) {
    await this.verificarPago(id);

    return this.prismaSuscripciones.pago.delete({
      where: {
        IdPago: id,
      },
    });
  }

  private async verificarPago(idPago: number): Promise<void> {
    const pago = await this.prismaSuscripciones.pago.findUnique({
      where: {
        IdPago: idPago,
      },
      select: {
        IdPago: true,
      },
    });

    if (!pago) {
      throw new NotFoundException(
        `No existe un pago con el ID ${idPago}.`,
      );
    }
  }

  private async verificarSuscripcion(
    idSuscripcion: number,
  ): Promise<void> {
    const suscripcion =
      await this.prismaSuscripciones.suscripcion.findUnique({
        where: {
          IdSuscripcion: idSuscripcion,
        },
        select: {
          IdSuscripcion: true,
        },
      });

    if (!suscripcion) {
      throw new NotFoundException(
        `No existe una suscripción con el ID ${idSuscripcion}.`,
      );
    }
  }
}