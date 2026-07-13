/* src/matches/matches.service.ts: */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TipoInteraccion } from '../generated/prisma-interacciones/enums';
import { PrismaInteraccionesService } from '../prisma-interacciones/prisma-interacciones.service';
import { PrismaUsuariosService } from '../prisma-usuarios/prisma-usuarios.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class MatchesService {
  constructor(
    private readonly prismaInteracciones: PrismaInteraccionesService,
    private readonly prismaUsuarios: PrismaUsuariosService,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    const { UsuarioUnoFK, UsuarioDosFK } = createMatchDto;

    this.verificarUsuariosDiferentes(UsuarioUnoFK, UsuarioDosFK);

    const [usuarioUno, usuarioDos] = await Promise.all([
      this.obtenerUsuario(UsuarioUnoFK),
      this.obtenerUsuario(UsuarioDosFK),
    ]);

    await this.verificarInteraccionesMutuas(UsuarioUnoFK, UsuarioDosFK);

    await this.verificarMatchDuplicado(UsuarioUnoFK, UsuarioDosFK);

    const match = await this.prismaInteracciones.match.create({
      data: createMatchDto,
    });

    return {
      ...match,
      usuarioUno,
      usuarioDos,
    };
  }

  async findAll() {
    const matches = await this.prismaInteracciones.match.findMany({
      include: {
        chat: true,
      },
    });

    if (matches.length === 0) {
      return [];
    }

    const usuariosPorId = await this.obtenerUsuariosPorIds(
      matches.flatMap((match) => [match.UsuarioUnoFK, match.UsuarioDosFK]),
    );

    return matches.map((match) => ({
      ...match,
      usuarioUno: usuariosPorId.get(match.UsuarioUnoFK) ?? null,
      usuarioDos: usuariosPorId.get(match.UsuarioDosFK) ?? null,
    }));
  }

  async findByUsuario(idUsuario: number) {
    await this.verificarUsuario(idUsuario);

    const matches = await this.prismaInteracciones.match.findMany({
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
        chat: true,
      },
    });

    const usuariosPorId = await this.obtenerUsuariosPorIds(
      matches.flatMap((match) => [match.UsuarioUnoFK, match.UsuarioDosFK]),
    );

    return matches.map((match) => ({
      ...match,
      usuarioUno: usuariosPorId.get(match.UsuarioUnoFK) ?? null,
      usuarioDos: usuariosPorId.get(match.UsuarioDosFK) ?? null,
    }));
  }

  async findOne(id: number) {
    const match = await this.obtenerMatch(id);

    const [usuarioUno, usuarioDos] = await Promise.all([
      this.obtenerUsuario(match.UsuarioUnoFK),
      this.obtenerUsuario(match.UsuarioDosFK),
    ]);

    return {
      ...match,
      usuarioUno,
      usuarioDos,
    };
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    const matchActual = await this.obtenerMatch(id);

    const cambiaUsuarioUno =
      updateMatchDto.UsuarioUnoFK !== undefined &&
      updateMatchDto.UsuarioUnoFK !== matchActual.UsuarioUnoFK;

    const cambiaUsuarioDos =
      updateMatchDto.UsuarioDosFK !== undefined &&
      updateMatchDto.UsuarioDosFK !== matchActual.UsuarioDosFK;

    if (matchActual.chat && (cambiaUsuarioUno || cambiaUsuarioDos)) {
      throw new ConflictException(
        'No se pueden modificar los usuarios del match porque ya tiene un chat asociado.',
      );
    }

    const idUsuarioUno =
      updateMatchDto.UsuarioUnoFK ?? matchActual.UsuarioUnoFK;

    const idUsuarioDos =
      updateMatchDto.UsuarioDosFK ?? matchActual.UsuarioDosFK;

    this.verificarUsuariosDiferentes(idUsuarioUno, idUsuarioDos);

    const [usuarioUno, usuarioDos] = await Promise.all([
      this.obtenerUsuario(idUsuarioUno),
      this.obtenerUsuario(idUsuarioDos),
    ]);

    await this.verificarInteraccionesMutuas(idUsuarioUno, idUsuarioDos);

    await this.verificarMatchDuplicado(idUsuarioUno, idUsuarioDos, id);

    const matchActualizado = await this.prismaInteracciones.match.update({
      where: {
        IdMatch: id,
      },
      data: updateMatchDto,
      include: {
        chat: true,
      },
    });

    return {
      ...matchActualizado,
      usuarioUno,
      usuarioDos,
    };
  }

  async remove(id: number) {
    const match = await this.obtenerMatch(id);

    if (match.chat) {
      throw new ConflictException(
        'No se puede eliminar el match porque ya tiene un chat asociado.',
      );
    }

    return this.prismaInteracciones.match.delete({
      where: {
        IdMatch: id,
      },
    });
  }

  private async obtenerMatch(id: number) {
    const match = await this.prismaInteracciones.match.findUnique({
      where: {
        IdMatch: id,
      },
      include: {
        chat: true,
      },
    });

    if (!match) {
      throw new NotFoundException(`No existe un match con el ID ${id}.`);
    }

    return match;
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

  private async verificarUsuario(idUsuario: number): Promise<void> {
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
      usuarios.map((usuario) => [usuario.IdUsuario, usuario] as const),
    );
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
    const tiposPositivos: TipoInteraccion[] = [
      TipoInteraccion.LIKE,
      TipoInteraccion.SUPERLIKE,
    ];

    const [interaccionUsuarioUno, interaccionUsuarioDos] = await Promise.all([
      this.prismaInteracciones.interaccion.findFirst({
        where: {
          UsuarioEmisorFK: idUsuarioUno,
          UsuarioReceptorFK: idUsuarioDos,
          tipoInteraccion: {
            in: tiposPositivos,
          },
        },
      }),
      this.prismaInteracciones.interaccion.findFirst({
        where: {
          UsuarioEmisorFK: idUsuarioDos,
          UsuarioReceptorFK: idUsuarioUno,
          tipoInteraccion: {
            in: tiposPositivos,
          },
        },
      }),
    ]);

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
    const matchExistente = await this.prismaInteracciones.match.findFirst({
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
