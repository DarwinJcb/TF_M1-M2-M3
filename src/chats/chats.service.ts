/* src/chats/chats.service.ts: */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createChatDto: CreateChatDto) {
    await this.verificarMatch(createChatDto.MatchFK);

    const chatExistente = await this.prisma.chat.findUnique({
      where: {
        MatchFK: createChatDto.MatchFK,
      },
    });

    if (chatExistente) {
      throw new ConflictException(
        `El match con el ID ${createChatDto.MatchFK} ya tiene un chat.`,
      );
    }

    return this.prisma.chat.create({
      data: createChatDto,
      include: {
        match: true,
      },
    });
  }

  findAll() {
    return this.prisma.chat.findMany({
      include: {
        match: true,
        mensajes: true,
      },
    });
  }

  async findByMatch(idMatch: number) {
    await this.verificarMatch(idMatch);

    const chat = await this.prisma.chat.findUnique({
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
    const chat = await this.prisma.chat.findUnique({
      where: {
        IdChat: id,
      },
      include: {
        match: true,
        mensajes: true,
      },
    });

    if (!chat) {
      throw new NotFoundException(`No existe un chat con el ID ${id}.`);
    }

    return chat;
  }

  async update(id: number, updateChatDto: UpdateChatDto) {
    await this.findOne(id);

    if (updateChatDto.MatchFK !== undefined) {
      await this.verificarMatch(updateChatDto.MatchFK);

      const chatDelMatch = await this.prisma.chat.findUnique({
        where: {
          MatchFK: updateChatDto.MatchFK,
        },
      });

      if (chatDelMatch && chatDelMatch.IdChat !== id) {
        throw new ConflictException(
          `El match con el ID ${updateChatDto.MatchFK} ya tiene un chat.`,
        );
      }
    }

    return this.prisma.chat.update({
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

    return this.prisma.chat.delete({
      where: {
        IdChat: id,
      },
    });
  }

  private async verificarMatch(idMatch: number): Promise<void> {
    const match = await this.prisma.match.findUnique({
      where: {
        IdMatch: idMatch,
      },
      select: {
        IdMatch: true,
      },
    });

    if (!match) {
      throw new NotFoundException(`No existe un match con el ID ${idMatch}.`);
    }
  }
}
