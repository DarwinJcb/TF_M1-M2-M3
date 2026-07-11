/* src/pagos/pagos.service.ts: */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@Injectable()
export class PagosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPagoDto: CreatePagoDto) {
    await this.verificarSuscripcionUsuario(createPagoDto.SuscripcionUsuarioFK);

    return this.prisma.pago.create({
      data: createPagoDto,
      include: {
        suscripcionUsuario: {
          include: {
            usuario: true,
            planSuscripcion: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.pago.findMany({
      include: {
        suscripcionUsuario: {
          include: {
            usuario: true,
            planSuscripcion: true,
          },
        },
      },
    });
  }

  async findBySuscripcion(idSuscripcionUsuario: number) {
    await this.verificarSuscripcionUsuario(idSuscripcionUsuario);

    return this.prisma.pago.findMany({
      where: {
        SuscripcionUsuarioFK: idSuscripcionUsuario,
      },
    });
  }

  async findOne(id: number) {
    const pago = await this.prisma.pago.findUnique({
      where: {
        IdPago: id,
      },
      include: {
        suscripcionUsuario: {
          include: {
            usuario: true,
            planSuscripcion: true,
          },
        },
      },
    });

    if (!pago) {
      throw new NotFoundException(`No existe un pago con el ID ${id}.`);
    }

    return pago;
  }

  async update(id: number, updatePagoDto: UpdatePagoDto) {
    await this.findOne(id);

    if (updatePagoDto.SuscripcionUsuarioFK !== undefined) {
      await this.verificarSuscripcionUsuario(
        updatePagoDto.SuscripcionUsuarioFK,
      );
    }

    return this.prisma.pago.update({
      where: {
        IdPago: id,
      },
      data: updatePagoDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.pago.delete({
      where: {
        IdPago: id,
      },
    });
  }

  private async verificarSuscripcionUsuario(
    idSuscripcionUsuario: number,
  ): Promise<void> {
    const suscripcionUsuario = await this.prisma.suscripcionUsuario.findUnique({
      where: {
        IdSuscripcionUsuario: idSuscripcionUsuario,
      },
      select: {
        IdSuscripcionUsuario: true,
      },
    });

    if (!suscripcionUsuario) {
      throw new NotFoundException(
        `No existe una suscripción de usuario con el ID ${idSuscripcionUsuario}.`,
      );
    }
  }
}
