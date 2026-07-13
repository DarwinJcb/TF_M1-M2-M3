/* src/mensajes/mensajes.service.ts: */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaInteraccionesService } from '../prisma-interacciones/prisma-interacciones.service';
import { PrismaUsuariosService } from '../prisma-usuarios/prisma-usuarios.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { UpdateMensajeDto } from './dto/update-mensaje.dto';

@Injectable()
export class MensajesService {
  constructor(
    private readonly prismaInteracciones: PrismaInteraccionesService,
    private readonly prismaUsuarios: PrismaUsuariosService,
  ) { }

  async create(createMensajeDto: CreateMensajeDto) {
    const chat = await this.obtenerChatConMatch(
      createMensajeDto.ChatFK,
    );

    const usuarioEmisor = await this.obtenerUsuario(
      createMensajeDto.UsuarioEmisorFK,
    );

    this.verificarUsuarioPerteneceAlMatch(
      createMensajeDto.UsuarioEmisorFK,
      chat.match.UsuarioUnoFK,
      chat.match.UsuarioDosFK,
    );

    const mensaje =
      await this.prismaInteracciones.mensaje.create({
        data: createMensajeDto,
        include: {
          chat: {
            include: {
              match: true,
            },
          },
        },
      });

    return {
      ...mensaje,
      usuarioEmisor,
    };
  }

  async findAll() {
    const mensajes =
      await this.prismaInteracciones.mensaje.findMany({
        include: {
          chat: {
            include: {
              match: true,
            },
          },
        },
        orderBy: {
          fechaEnvio: 'asc',
        },
      });

    if (mensajes.length === 0) {
      return [];
    }

    const usuariosPorId = await this.obtenerUsuariosPorIds(
      mensajes.map((mensaje) => mensaje.UsuarioEmisorFK),
    );

    return mensajes.map((mensaje) => ({
      ...mensaje,
      usuarioEmisor:
        usuariosPorId.get(mensaje.UsuarioEmisorFK) ?? null,
    }));
  }

  async findByChat(idChat: number) {
    await this.obtenerChatConMatch(idChat);

    const mensajes =
      await this.prismaInteracciones.mensaje.findMany({
        where: {
          ChatFK: idChat,
        },
        orderBy: {
          fechaEnvio: 'asc',
        },
      });

    if (mensajes.length === 0) {
      return [];
    }

    const usuariosPorId = await this.obtenerUsuariosPorIds(
      mensajes.map((mensaje) => mensaje.UsuarioEmisorFK),
    );

    return mensajes.map((mensaje) => ({
      ...mensaje,
      usuarioEmisor:
        usuariosPorId.get(mensaje.UsuarioEmisorFK) ?? null,
    }));
  }

  async findByUsuario(idUsuario: number) {
    await this.verificarUsuario(idUsuario);

    return this.prismaInteracciones.mensaje.findMany({
      where: {
        UsuarioEmisorFK: idUsuario,
      },
      include: {
        chat: {
          include: {
            match: true,
          },
        },
      },
      orderBy: {
        fechaEnvio: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const mensaje = await this.obtenerMensaje(id);

    const usuarioEmisor = await this.obtenerUsuario(
      mensaje.UsuarioEmisorFK,
    );

    return {
      ...mensaje,
      usuarioEmisor,
    };
  }

  async update(
    id: number,
    updateMensajeDto: UpdateMensajeDto,
  ) {
    const mensajeActual = await this.obtenerMensaje(id);

    const idChat =
      updateMensajeDto.ChatFK ?? mensajeActual.ChatFK;

    const idUsuarioEmisor =
      updateMensajeDto.UsuarioEmisorFK ??
      mensajeActual.UsuarioEmisorFK;

    const chat = await this.obtenerChatConMatch(idChat);

    const usuarioEmisor = await this.obtenerUsuario(
      idUsuarioEmisor,
    );

    this.verificarUsuarioPerteneceAlMatch(
      idUsuarioEmisor,
      chat.match.UsuarioUnoFK,
      chat.match.UsuarioDosFK,
    );

    const mensajeActualizado =
      await this.prismaInteracciones.mensaje.update({
        where: {
          IdMensaje: id,
        },
        data: updateMensajeDto,
        include: {
          chat: {
            include: {
              match: true,
            },
          },
        },
      });

    return {
      ...mensajeActualizado,
      usuarioEmisor,
    };
  }

  async remove(id: number) {
    await this.obtenerMensaje(id);

    return this.prismaInteracciones.mensaje.delete({
      where: {
        IdMensaje: id,
      },
    });
  }

  private async obtenerMensaje(idMensaje: number) {
    const mensaje =
      await this.prismaInteracciones.mensaje.findUnique({
        where: {
          IdMensaje: idMensaje,
        },
        include: {
          chat: {
            include: {
              match: true,
            },
          },
        },
      });

    if (!mensaje) {
      throw new NotFoundException(
        `No existe un mensaje con el ID ${idMensaje}.`,
      );
    }

    return mensaje;
  }

  private async obtenerChatConMatch(idChat: number) {
    const chat =
      await this.prismaInteracciones.chat.findUnique({
        where: {
          IdChat: idChat,
        },
        include: {
          match: true,
        },
      });

    if (!chat) {
      throw new NotFoundException(
        `No existe un chat con el ID ${idChat}.`,
      );
    }

    return chat;
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

  private async verificarUsuario(
    idUsuario: number,
  ): Promise<void> {
    const usuario = await this.prismaUsuarios.usuario.findUnique({
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
      usuarios.map((usuario) => [usuario.IdUsuario, usuario]),
    );
  }

  private verificarUsuarioPerteneceAlMatch(
    idUsuario: number,
    idUsuarioUno: number,
    idUsuarioDos: number,
  ): void {
    const perteneceAlMatch =
      idUsuario === idUsuarioUno ||
      idUsuario === idUsuarioDos;

    if (!perteneceAlMatch) {
      throw new ForbiddenException(
        'El usuario no pertenece al match asociado con este chat.',
      );
    }
  }
}