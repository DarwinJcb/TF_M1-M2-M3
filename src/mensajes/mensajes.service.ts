/* src/mensajes/mensajes.service.ts: */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { UpdateMensajeDto } from './dto/update-mensaje.dto';

@Injectable()
export class MensajesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMensajeDto: CreateMensajeDto) {
    const chat = await this.obtenerChatConMatch(createMensajeDto.ChatFK);

    await this.verificarUsuario(createMensajeDto.UsuarioEmisorFK);

    this.verificarUsuarioPerteneceAlMatch(
      createMensajeDto.UsuarioEmisorFK,
      chat.match.UsuarioUnoFK,
      chat.match.UsuarioDosFK,
    );

    return this.prisma.mensaje.create({
      data: createMensajeDto,
      include: {
        chat: {
          include: {
            match: true,
          },
        },
        usuarioEmisor: true,
      },
    });
  }

  findAll() {
    return this.prisma.mensaje.findMany({
      include: {
        chat: {
          include: {
            match: true,
          },
        },
        usuarioEmisor: true,
      },
      orderBy: {
        fechaEnvio: 'asc',
      },
    });
  }

  async findByChat(idChat: number) {
    await this.obtenerChatConMatch(idChat);

    return this.prisma.mensaje.findMany({
      where: {
        ChatFK: idChat,
      },
      include: {
        usuarioEmisor: true,
      },
      orderBy: {
        fechaEnvio: 'asc',
      },
    });
  }

  async findByUsuario(idUsuario: number) {
    await this.verificarUsuario(idUsuario);

    return this.prisma.mensaje.findMany({
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
    const mensaje = await this.prisma.mensaje.findUnique({
      where: {
        IdMensaje: id,
      },
      include: {
        chat: {
          include: {
            match: true,
          },
        },
        usuarioEmisor: true,
      },
    });

    if (!mensaje) {
      throw new NotFoundException(`No existe un mensaje con el ID ${id}.`);
    }

    return mensaje;
  }

  async update(id: number, updateMensajeDto: UpdateMensajeDto) {
    const mensajeActual = await this.findOne(id);

    const idChat = updateMensajeDto.ChatFK ?? mensajeActual.ChatFK;

    const idUsuarioEmisor =
      updateMensajeDto.UsuarioEmisorFK ?? mensajeActual.UsuarioEmisorFK;

    const chat = await this.obtenerChatConMatch(idChat);

    await this.verificarUsuario(idUsuarioEmisor);

    this.verificarUsuarioPerteneceAlMatch(
      idUsuarioEmisor,
      chat.match.UsuarioUnoFK,
      chat.match.UsuarioDosFK,
    );

    return this.prisma.mensaje.update({
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
        usuarioEmisor: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.mensaje.delete({
      where: {
        IdMensaje: id,
      },
    });
  }

  private async obtenerChatConMatch(idChat: number) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        IdChat: idChat,
      },
      include: {
        match: true,
      },
    });

    if (!chat) {
      throw new NotFoundException(`No existe un chat con el ID ${idChat}.`);
    }

    return chat;
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

  private verificarUsuarioPerteneceAlMatch(
    idUsuario: number,
    idUsuarioUno: number,
    idUsuarioDos: number,
  ): void {
    const perteneceAlMatch =
      idUsuario === idUsuarioUno || idUsuario === idUsuarioDos;

    if (!perteneceAlMatch) {
      throw new ForbiddenException(
        'El usuario no pertenece al match asociado con este chat.',
      );
    }
  }
}
