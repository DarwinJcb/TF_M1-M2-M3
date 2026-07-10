/* src/intereses/intereses.service.ts */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInteresDto } from './dto/create-interes.dto';
import { UpdateInteresDto } from './dto/update-interes.dto';

@Injectable()
export class InteresesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInteresDto: CreateInteresDto) {
    await this.verificarUsuario(createInteresDto.UsuarioFK);

    const interesExistente = await this.prisma.interes.findUnique({
      where: {
        UsuarioFK: createInteresDto.UsuarioFK,
      },
    });

    if (interesExistente) {
      throw new ConflictException(
        `El usuario con el ID ${createInteresDto.UsuarioFK} ya tiene intereses registrados.`,
      );
    }

    return this.prisma.interes.create({
      data: createInteresDto,
    });
  }

  findAll() {
    return this.prisma.interes.findMany();
  }

  async findByUsuario(idUsuario: number) {
    await this.verificarUsuario(idUsuario);

    const interes = await this.prisma.interes.findUnique({
      where: {
        UsuarioFK: idUsuario,
      },
    });

    if (!interes) {
      throw new NotFoundException(
        `El usuario con el ID ${idUsuario} no tiene intereses registrados.`,
      );
    }

    return interes;
  }

  async findOne(id: number) {
    const interes = await this.prisma.interes.findUnique({
      where: {
        IdInteres: id,
      },
    });

    if (!interes) {
      throw new NotFoundException(`No existe un interés con el ID ${id}.`);
    }

    return interes;
  }

  async update(id: number, updateInteresDto: UpdateInteresDto) {
    await this.findOne(id);

    if (updateInteresDto.UsuarioFK !== undefined) {
      await this.verificarUsuario(updateInteresDto.UsuarioFK);

      const interesDelUsuario = await this.prisma.interes.findUnique({
        where: {
          UsuarioFK: updateInteresDto.UsuarioFK,
        },
      });

      if (interesDelUsuario && interesDelUsuario.IdInteres !== id) {
        throw new ConflictException(
          `El usuario con el ID ${updateInteresDto.UsuarioFK} ya tiene intereses registrados.`,
        );
      }
    }

    return this.prisma.interes.update({
      where: {
        IdInteres: id,
      },
      data: updateInteresDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.interes.delete({
      where: {
        IdInteres: id,
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
}
