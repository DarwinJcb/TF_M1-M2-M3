/* src/interacciones/interacciones.service.ts: */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInteraccionDto } from './dto/create-interaccion.dto';
import { UpdateInteraccionDto } from './dto/update-interaccion.dto';

@Injectable()
export class InteraccionesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInteraccionDto: CreateInteraccionDto) {
    const { UsuarioEmisorFK, UsuarioReceptorFK } = createInteraccionDto;

    this.verificarUsuariosDiferentes(UsuarioEmisorFK, UsuarioReceptorFK);

    await this.verificarUsuario(UsuarioEmisorFK);
    await this.verificarUsuario(UsuarioReceptorFK);

    const interaccionExistente = await this.prisma.interaccion.findFirst({
      where: {
        UsuarioEmisorFK,
        UsuarioReceptorFK,
      },
    });

    if (interaccionExistente) {
      throw new ConflictException(
        `El usuario ${UsuarioEmisorFK} ya registró una interacción con el usuario ${UsuarioReceptorFK}.`,
      );
    }

    return this.prisma.interaccion.create({
      data: createInteraccionDto,
      include: {
        usuarioEmisor: true,
        usuarioReceptor: true,
      },
    });
  }

  findAll() {
    return this.prisma.interaccion.findMany({
      include: {
        usuarioEmisor: true,
        usuarioReceptor: true,
      },
    });
  }

  async findByEmisor(idUsuario: number) {
    await this.verificarUsuario(idUsuario);

    return this.prisma.interaccion.findMany({
      where: {
        UsuarioEmisorFK: idUsuario,
      },
      include: {
        usuarioReceptor: true,
      },
    });
  }

  async findByReceptor(idUsuario: number) {
    await this.verificarUsuario(idUsuario);

    return this.prisma.interaccion.findMany({
      where: {
        UsuarioReceptorFK: idUsuario,
      },
      include: {
        usuarioEmisor: true,
      },
    });
  }

  async findOne(id: number) {
    const interaccion = await this.prisma.interaccion.findUnique({
      where: {
        IdInteraccion: id,
      },
      include: {
        usuarioEmisor: true,
        usuarioReceptor: true,
      },
    });

    if (!interaccion) {
      throw new NotFoundException(`No existe una interacción con el ID ${id}.`);
    }

    return interaccion;
  }

  async update(id: number, updateInteraccionDto: UpdateInteraccionDto) {
    const interaccionActual = await this.findOne(id);

    const idUsuarioEmisor =
      updateInteraccionDto.UsuarioEmisorFK ?? interaccionActual.UsuarioEmisorFK;

    const idUsuarioReceptor =
      updateInteraccionDto.UsuarioReceptorFK ??
      interaccionActual.UsuarioReceptorFK;

    this.verificarUsuariosDiferentes(idUsuarioEmisor, idUsuarioReceptor);

    await this.verificarUsuario(idUsuarioEmisor);
    await this.verificarUsuario(idUsuarioReceptor);

    const interaccionDuplicada = await this.prisma.interaccion.findFirst({
      where: {
        UsuarioEmisorFK: idUsuarioEmisor,
        UsuarioReceptorFK: idUsuarioReceptor,
        NOT: {
          IdInteraccion: id,
        },
      },
    });

    if (interaccionDuplicada) {
      throw new ConflictException(
        `El usuario ${idUsuarioEmisor} ya registró una interacción con el usuario ${idUsuarioReceptor}.`,
      );
    }

    return this.prisma.interaccion.update({
      where: {
        IdInteraccion: id,
      },
      data: updateInteraccionDto,
      include: {
        usuarioEmisor: true,
        usuarioReceptor: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.interaccion.delete({
      where: {
        IdInteraccion: id,
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

  private verificarUsuariosDiferentes(
    idUsuarioEmisor: number,
    idUsuarioReceptor: number,
  ): void {
    if (idUsuarioEmisor === idUsuarioReceptor) {
      throw new BadRequestException(
        'Un usuario no puede interactuar consigo mismo.',
      );
    }
  }
}
