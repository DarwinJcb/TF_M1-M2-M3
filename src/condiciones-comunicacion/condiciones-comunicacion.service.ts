/* src/condiciones-comunicacion/condiciones-comunicacion.service.ts: */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCondicionComunicacionDto } from './dto/create-condicion-comunicacion.dto';
import { UpdateCondicionComunicacionDto } from './dto/update-condicion-comunicacion.dto';

@Injectable()
export class CondicionesComunicacionService {
  constructor(private readonly prisma: PrismaService) { }

  create(createCondicionComunicacionDto: CreateCondicionComunicacionDto) {
    return this.prisma.condicionComunicacion.create({
      data: createCondicionComunicacionDto,
    });
  }

  findAll() {
    return this.prisma.condicionComunicacion.findMany();
  }

  async findOne(id: number) {
    const condicionComunicacion =
      await this.prisma.condicionComunicacion.findUnique({
        where: {
          IdCondicionComunicacion: id,
        },
      });

    if (!condicionComunicacion) {
      throw new NotFoundException(
        `No existe una condición de comunicación con el ID ${id}.`,
      );
    }

    return condicionComunicacion;
  }

  async update(
    id: number,
    updateCondicionComunicacionDto: UpdateCondicionComunicacionDto,
  ) {
    await this.findOne(id);

    return this.prisma.condicionComunicacion.update({
      where: {
        IdCondicionComunicacion: id,
      },
      data: updateCondicionComunicacionDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.condicionComunicacion.delete({
      where: {
        IdCondicionComunicacion: id,
      },
    });
  }
}
