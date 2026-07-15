/* tf_m1-m2-m3/src/interacciones/interacciones.service.ts: */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaInteraccionesService } from '../prisma-interacciones/prisma-interacciones.service';
import { PrismaUsuariosService } from '../prisma-usuarios/prisma-usuarios.service';
import { CreateInteraccionDto } from './dto/create-interaccion.dto';
import { UpdateInteraccionDto } from './dto/update-interaccion.dto';

@Injectable()
export class InteraccionesService {
  constructor(
    private readonly prismaInteracciones: PrismaInteraccionesService,
    private readonly prismaUsuarios: PrismaUsuariosService,
  ) {}

  async create(createInteraccionDto: CreateInteraccionDto) {
    const { UsuarioEmisorFK, UsuarioReceptorFK } = createInteraccionDto;

    this.verificarUsuariosDiferentes(UsuarioEmisorFK, UsuarioReceptorFK);

    const [usuarioEmisor, usuarioReceptor] = await Promise.all([
      this.obtenerUsuario(UsuarioEmisorFK),
      this.obtenerUsuario(UsuarioReceptorFK),
    ]);

    const interaccionExistente =
      await this.prismaInteracciones.interaccion.findFirst({
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

    const interaccion = await this.prismaInteracciones.interaccion.create({
      data: createInteraccionDto,
    });

    return {
      ...interaccion,
      usuarioEmisor,
      usuarioReceptor,
    };
  }

  async findAll() {
    const interacciones = await this.prismaInteracciones.interaccion.findMany();

    if (interacciones.length === 0) {
      return [];
    }

    const usuariosPorId = await this.obtenerUsuariosPorIds(
      interacciones.flatMap((interaccion) => [
        interaccion.UsuarioEmisorFK,
        interaccion.UsuarioReceptorFK,
      ]),
    );

    return interacciones.map((interaccion) => ({
      ...interaccion,
      usuarioEmisor: usuariosPorId.get(interaccion.UsuarioEmisorFK) ?? null,
      usuarioReceptor: usuariosPorId.get(interaccion.UsuarioReceptorFK) ?? null,
    }));
  }

  async findByEmisor(idUsuario: number) {
    const usuarioEmisor = await this.obtenerUsuario(idUsuario);

    const interacciones = await this.prismaInteracciones.interaccion.findMany({
      where: {
        UsuarioEmisorFK: idUsuario,
      },
    });

    const usuariosPorId = await this.obtenerUsuariosPorIds(
      interacciones.map((interaccion) => interaccion.UsuarioReceptorFK),
    );

    return interacciones.map((interaccion) => ({
      ...interaccion,
      usuarioEmisor,
      usuarioReceptor: usuariosPorId.get(interaccion.UsuarioReceptorFK) ?? null,
    }));
  }

  async findByReceptor(idUsuario: number) {
    const usuarioReceptor = await this.obtenerUsuario(idUsuario);

    const interacciones = await this.prismaInteracciones.interaccion.findMany({
      where: {
        UsuarioReceptorFK: idUsuario,
      },
    });

    const usuariosPorId = await this.obtenerUsuariosPorIds(
      interacciones.map((interaccion) => interaccion.UsuarioEmisorFK),
    );

    return interacciones.map((interaccion) => ({
      ...interaccion,
      usuarioEmisor: usuariosPorId.get(interaccion.UsuarioEmisorFK) ?? null,
      usuarioReceptor,
    }));
  }

  async findOne(id: number) {
    const interaccion = await this.obtenerInteraccion(id);

    const [usuarioEmisor, usuarioReceptor] = await Promise.all([
      this.obtenerUsuario(interaccion.UsuarioEmisorFK),
      this.obtenerUsuario(interaccion.UsuarioReceptorFK),
    ]);

    return {
      ...interaccion,
      usuarioEmisor,
      usuarioReceptor,
    };
  }

  async update(id: number, updateInteraccionDto: UpdateInteraccionDto) {
    const interaccionActual = await this.obtenerInteraccion(id);

    const idUsuarioEmisor =
      updateInteraccionDto.UsuarioEmisorFK ?? interaccionActual.UsuarioEmisorFK;

    const idUsuarioReceptor =
      updateInteraccionDto.UsuarioReceptorFK ??
      interaccionActual.UsuarioReceptorFK;

    this.verificarUsuariosDiferentes(idUsuarioEmisor, idUsuarioReceptor);

    const [usuarioEmisor, usuarioReceptor] = await Promise.all([
      this.obtenerUsuario(idUsuarioEmisor),
      this.obtenerUsuario(idUsuarioReceptor),
    ]);

    const interaccionDuplicada =
      await this.prismaInteracciones.interaccion.findFirst({
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

    const interaccionActualizada =
      await this.prismaInteracciones.interaccion.update({
        where: {
          IdInteraccion: id,
        },
        data: updateInteraccionDto,
      });

    return {
      ...interaccionActualizada,
      usuarioEmisor,
      usuarioReceptor,
    };
  }

  async remove(id: number) {
    await this.obtenerInteraccion(id);

    return this.prismaInteracciones.interaccion.delete({
      where: {
        IdInteraccion: id,
      },
    });
  }

  private async obtenerInteraccion(id: number) {
    const interaccion = await this.prismaInteracciones.interaccion.findUnique({
      where: {
        IdInteraccion: id,
      },
    });

    if (!interaccion) {
      throw new NotFoundException(`No existe una interacción con el ID ${id}.`);
    }

    return interaccion;
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

  private async obtenerUsuariosPorIds(idsUsuarios: number[]) {
    const identificadoresUnicos = [...new Set(idsUsuarios)];

    const usuarios = await this.prismaUsuarios.usuario.findMany({
      where: {
        IdUsuario: {
          in: identificadoresUnicos,
        },
      },
    });

    return new Map(
      usuarios.map((usuario) => [usuario.IdUsuario, usuario] as const),
    );
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
