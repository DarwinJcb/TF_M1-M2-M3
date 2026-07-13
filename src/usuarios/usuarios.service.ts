/* src/usuarios/usuarios.service.ts: */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaSuscripcionesService } from '../prisma-suscripciones/prisma-suscripciones.service';
import { PrismaUsuariosService } from '../prisma-usuarios/prisma-usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly prismaUsuarios: PrismaUsuariosService,
    private readonly prismaSuscripciones: PrismaSuscripcionesService,
  ) { }

  private async verificarUsuarioExiste(id: number): Promise<void> {
    const usuario = await this.prismaUsuarios.usuario.findUnique({
      where: {
        IdUsuario: id,
      },
      select: {
        IdUsuario: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(`No existe un usuario con el ID ${id}.`);
    }
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuarioExistente = await this.prismaUsuarios.usuario.findFirst({
      where: {
        OR: [
          {
            correo: createUsuarioDto.correo,
          },
          {
            numeroTelefono: createUsuarioDto.numeroTelefono,
          },
        ],
      },
    });

    if (usuarioExistente) {
      throw new ConflictException(
        'El correo o el número de teléfono ya están registrados.',
      );
    }

    return this.prismaUsuarios.usuario.create({
      data: createUsuarioDto,
    });
  }

  async findAll() {
    const usuarios = await this.prismaUsuarios.usuario.findMany({
      include: {
        interes: true,
        fotos: true,
        ubicaciones: true,
        musicas: true,
      },
    });

    if (usuarios.length === 0) {
      return [];
    }

    const identificadoresUsuarios = usuarios.map(
      (usuario) => usuario.IdUsuario,
    );

    const suscripciones =
      await this.prismaSuscripciones.suscripcion.findMany({
        where: {
          UsuarioFK: {
            in: identificadoresUsuarios,
          },
        },
        include: {
          planSuscripcion: true,
        },
      });

    const suscripcionesPorUsuario = new Map(
      suscripciones.map((suscripcion) => [
        suscripcion.UsuarioFK,
        suscripcion,
      ]),
    );

    return usuarios.map((usuario) => ({
      ...usuario,
      suscripcion:
        suscripcionesPorUsuario.get(usuario.IdUsuario) ?? null,
    }));
  }

  async findOne(id: number) {
    const usuario = await this.prismaUsuarios.usuario.findUnique({
      where: {
        IdUsuario: id,
      },
      include: {
        interes: true,
        fotos: true,
        ubicaciones: true,
        musicas: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(`No existe un usuario con el ID ${id}.`);
    }

    const suscripcion =
      await this.prismaSuscripciones.suscripcion.findUnique({
        where: {
          UsuarioFK: id,
        },
        include: {
          planSuscripcion: true,
        },
      });

    return {
      ...usuario,
      suscripcion,
    };
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.verificarUsuarioExiste(id);

    if (updateUsuarioDto.correo !== undefined) {
      const usuarioConCorreo =
        await this.prismaUsuarios.usuario.findFirst({
          where: {
            correo: updateUsuarioDto.correo,
            NOT: {
              IdUsuario: id,
            },
          },
        });

      if (usuarioConCorreo) {
        throw new ConflictException('El correo ya está registrado.');
      }
    }

    if (updateUsuarioDto.numeroTelefono !== undefined) {
      const usuarioConTelefono =
        await this.prismaUsuarios.usuario.findFirst({
          where: {
            numeroTelefono: updateUsuarioDto.numeroTelefono,
            NOT: {
              IdUsuario: id,
            },
          },
        });

      if (usuarioConTelefono) {
        throw new ConflictException(
          'El número de teléfono ya está registrado.',
        );
      }
    }

    return this.prismaUsuarios.usuario.update({
      where: {
        IdUsuario: id,
      },
      data: updateUsuarioDto,
    });
  }

  async remove(id: number) {
    await this.verificarUsuarioExiste(id);

    return this.prismaUsuarios.usuario.delete({
      where: {
        IdUsuario: id,
      },
    });
  }
}