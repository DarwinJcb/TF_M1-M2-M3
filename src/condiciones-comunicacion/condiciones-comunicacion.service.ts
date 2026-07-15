/* tf_m1-m2-m3/src/condiciones-comunicacion/condiciones-comunicacion.service.ts */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaInteraccionesService } from '../prisma-interacciones/prisma-interacciones.service';
import { CreateCondicionComunicacionDto } from './dto/create-condicion-comunicacion.dto';
import { UpdateCondicionComunicacionDto } from './dto/update-condicion-comunicacion.dto';

@Injectable()
export class CondicionesComunicacionService {
  constructor(
    private readonly prismaInteracciones: PrismaInteraccionesService,
  ) {}

  create(createCondicionComunicacionDto: CreateCondicionComunicacionDto) {
    return this.prismaInteracciones.condicionComunicacion.create({
      data: createCondicionComunicacionDto,
    });
  }

  findAll() {
    return this.prismaInteracciones.condicionComunicacion.findMany();
  }

  async findOne(id: number) {
    const condicionComunicacion =
      await this.prismaInteracciones.condicionComunicacion.findUnique({
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

    return this.prismaInteracciones.condicionComunicacion.update({
      where: {
        IdCondicionComunicacion: id,
      },
      data: updateCondicionComunicacionDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prismaInteracciones.condicionComunicacion.delete({
      where: {
        IdCondicionComunicacion: id,
      },
    });
  }
}
