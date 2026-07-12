/* src/pagos/pagos.service.ts: */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@Injectable()
export class PagosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPagoDto: CreatePagoDto) {
    await this.verificarSuscripcion(createPagoDto.SuscripcionFK);

    return this.prisma.pago.create({
      data: createPagoDto,
      include: {
        suscripcion: {
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
        suscripcion: {
          include: {
            usuario: true,
            planSuscripcion: true,
          },
        },
      },
    });
  }

  async findBySuscripcion(idSuscripcion: number) {
    await this.verificarSuscripcion(idSuscripcion);

    return this.prisma.pago.findMany({
      where: {
        SuscripcionFK: idSuscripcion,
      },
    });
  }

  async findOne(id: number) {
    const pago = await this.prisma.pago.findUnique({
      where: {
        IdPago: id,
      },
      include: {
        suscripcion: {
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

    if (updatePagoDto.SuscripcionFK !== undefined) {
      await this.verificarSuscripcion(updatePagoDto.SuscripcionFK);
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

  private async verificarSuscripcion(idSuscripcion: number): Promise<void> {
    const suscripcion = await this.prisma.suscripcion.findUnique({
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
