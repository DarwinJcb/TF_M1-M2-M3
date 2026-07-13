/* src/chats/chats.service.ts: */
import { ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaInteraccionesService } from '../prisma-interacciones/prisma-interacciones.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    private readonly prismaInteracciones: PrismaInteraccionesService,
  ) { }

  async create(createChatDto: CreateChatDto) {
    await this.verificarMatch(createChatDto.MatchFK);

    const chatExistente =
      await this.prismaInteracciones.chat.findUnique({
        where: {
          MatchFK: createChatDto.MatchFK,
        },
      });

    if (chatExistente) {
      throw new ConflictException(
        `El match con el ID ${createChatDto.MatchFK} ya tiene un chat.`,
      );
    }

    return this.prismaInteracciones.chat.create({
      data: createChatDto,
      include: {
        match: true,
        mensajes: true,
      },
    });
  }

  findAll() {
    return this.prismaInteracciones.chat.findMany({
      include: {
        match: true,
        mensajes: true,
      },
    });
  }

  async findByMatch(idMatch: number) {
    await this.verificarMatch(idMatch);

    const chat =
      await this.prismaInteracciones.chat.findUnique({
        where: {
          MatchFK: idMatch,
        },
        include: {
          match: true,
          mensajes: true,
        },
      });

    if (!chat) {
      throw new NotFoundException(
        `El match con el ID ${idMatch} no tiene un chat.`,
      );
    }

    return chat;
  }

  async findOne(id: number) {
    const chat =
      await this.prismaInteracciones.chat.findUnique({
        where: {
          IdChat: id,
        },
        include: {
          match: true,
          mensajes: true,
        },
      });

    if (!chat) {
      throw new NotFoundException(
        `No existe un chat con el ID ${id}.`,
      );
    }

    return chat;
  }

  async update(
    id: number,
    updateChatDto: UpdateChatDto,
  ) {
    const chatActual = await this.findOne(id);
    const idNuevoMatch = updateChatDto.MatchFK;

    if (
      idNuevoMatch !== undefined &&
      idNuevoMatch !== chatActual.MatchFK
    ) {
      if (chatActual.mensajes.length > 0) {
        throw new ConflictException(
          'No se puede cambiar el match del chat porque contiene mensajes.',
        );
      }

      await this.verificarMatch(idNuevoMatch);

      const chatDelMatch =
        await this.prismaInteracciones.chat.findUnique({
          where: {
            MatchFK: idNuevoMatch,
          },
        });

      if (chatDelMatch && chatDelMatch.IdChat !== id) {
        throw new ConflictException(
          `El match con el ID ${idNuevoMatch} ya tiene un chat.`,
        );
      }
    }

    return this.prismaInteracciones.chat.update({
      where: {
        IdChat: id,
      },
      data: updateChatDto,
      include: {
        match: true,
        mensajes: true,
      },
    });
  }

  async remove(id: number) {
    const chat = await this.findOne(id);

    if (chat.mensajes.length > 0) {
      throw new ConflictException(
        'No se puede eliminar el chat porque contiene mensajes.',
      );
    }

    return this.prismaInteracciones.chat.delete({
      where: {
        IdChat: id,
      },
    });
  }

  private async verificarMatch(
    idMatch: number,
  ): Promise<void> {
    const match =
      await this.prismaInteracciones.match.findUnique({
        where: {
          IdMatch: idMatch,
        },
        select: {
          IdMatch: true,
        },
      });

    if (!match) {
      throw new NotFoundException(
        `No existe un match con el ID ${idMatch}.`,
      );
    }
  }
}