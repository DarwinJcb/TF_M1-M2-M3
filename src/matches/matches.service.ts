/* src/matches/matches.service.ts: */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TipoInteraccion } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMatchDto: CreateMatchDto) {
    const { UsuarioUnoFK, UsuarioDosFK } = createMatchDto;

    this.verificarUsuariosDiferentes(UsuarioUnoFK, UsuarioDosFK);

    await this.verificarUsuario(UsuarioUnoFK);
    await this.verificarUsuario(UsuarioDosFK);

    await this.verificarInteraccionesMutuas(UsuarioUnoFK, UsuarioDosFK);

    await this.verificarMatchDuplicado(UsuarioUnoFK, UsuarioDosFK);

    return this.prisma.match.create({
      data: createMatchDto,
      include: {
        usuarioUno: true,
        usuarioDos: true,
      },
    });
  }

  findAll() {
    return this.prisma.match.findMany({
      include: {
        usuarioUno: true,
        usuarioDos: true,
        chat: true,
      },
    });
  }

  async findByUsuario(idUsuario: number) {
    await this.verificarUsuario(idUsuario);

    return this.prisma.match.findMany({
      where: {
        OR: [
          {
            UsuarioUnoFK: idUsuario,
          },
          {
            UsuarioDosFK: idUsuario,
          },
        ],
      },
      include: {
        usuarioUno: true,
        usuarioDos: true,
        chat: true,
      },
    });
  }

  async findOne(id: number) {
    const match = await this.prisma.match.findUnique({
      where: {
        IdMatch: id,
      },
      include: {
        usuarioUno: true,
        usuarioDos: true,
        chat: true,
      },
    });

    if (!match) {
      throw new NotFoundException(`No existe un match con el ID ${id}.`);
    }

    return match;
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    const matchActual = await this.findOne(id);

    const idUsuarioUno =
      updateMatchDto.UsuarioUnoFK ?? matchActual.UsuarioUnoFK;

    const idUsuarioDos =
      updateMatchDto.UsuarioDosFK ?? matchActual.UsuarioDosFK;

    this.verificarUsuariosDiferentes(idUsuarioUno, idUsuarioDos);

    await this.verificarUsuario(idUsuarioUno);
    await this.verificarUsuario(idUsuarioDos);

    await this.verificarInteraccionesMutuas(idUsuarioUno, idUsuarioDos);

    await this.verificarMatchDuplicado(idUsuarioUno, idUsuarioDos, id);

    return this.prisma.match.update({
      where: {
        IdMatch: id,
      },
      data: updateMatchDto,
      include: {
        usuarioUno: true,
        usuarioDos: true,
        chat: true,
      },
    });
  }

  async remove(id: number) {
    const match = await this.findOne(id);

    if (match.chat) {
      throw new ConflictException(
        'No se puede eliminar el match porque ya tiene un chat asociado.',
      );
    }

    return this.prisma.match.delete({
      where: {
        IdMatch: id,
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
    idUsuarioUno: number,
    idUsuarioDos: number,
  ): void {
    if (idUsuarioUno === idUsuarioDos) {
      throw new BadRequestException(
        'Un usuario no puede hacer match consigo mismo.',
      );
    }
  }

  private async verificarInteraccionesMutuas(
    idUsuarioUno: number,
    idUsuarioDos: number,
  ): Promise<void> {
    const tiposPositivos = [TipoInteraccion.LIKE, TipoInteraccion.SUPERLIKE];

    const interaccionUsuarioUno = await this.prisma.interaccion.findFirst({
      where: {
        UsuarioEmisorFK: idUsuarioUno,
        UsuarioReceptorFK: idUsuarioDos,
        tipoInteraccion: {
          in: tiposPositivos,
        },
      },
    });

    const interaccionUsuarioDos = await this.prisma.interaccion.findFirst({
      where: {
        UsuarioEmisorFK: idUsuarioDos,
        UsuarioReceptorFK: idUsuarioUno,
        tipoInteraccion: {
          in: tiposPositivos,
        },
      },
    });

    if (!interaccionUsuarioUno || !interaccionUsuarioDos) {
      throw new BadRequestException(
        'Para crear el match, ambos usuarios deben darse LIKE o SUPERLIKE.',
      );
    }
  }

  private async verificarMatchDuplicado(
    idUsuarioUno: number,
    idUsuarioDos: number,
    idMatchExcluir?: number,
  ): Promise<void> {
    const matchExistente = await this.prisma.match.findFirst({
      where: {
        OR: [
          {
            UsuarioUnoFK: idUsuarioUno,
            UsuarioDosFK: idUsuarioDos,
          },
          {
            UsuarioUnoFK: idUsuarioDos,
            UsuarioDosFK: idUsuarioUno,
          },
        ],
        ...(idMatchExcluir !== undefined
          ? {
              NOT: {
                IdMatch: idMatchExcluir,
              },
            }
          : {}),
      },
    });

    if (matchExistente) {
      throw new ConflictException(
        `Ya existe un match entre los usuarios ${idUsuarioUno} y ${idUsuarioDos}.`,
      );
    }
  }
}
