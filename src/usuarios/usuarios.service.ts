/* src/usuarios/usuarios.service.ts: */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuarioExistente = await this.prisma.usuario.findFirst({
      where: {
        OR: [
          { correo: createUsuarioDto.correo },
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

    return this.prisma.usuario.create({
      data: createUsuarioDto,
    });
  }

  findAll() {
    return this.prisma.usuario.findMany({
      include: {
        interes: true,
        fotos: true,
        ubicaciones: true,
        musicas: true,
        suscripcion: {
          include: {
            planSuscripcion: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        IdUsuario: id,
      },
      include: {
        interes: true,
        fotos: true,
        ubicaciones: true,
        musicas: true,
        suscripcion: {
          include: {
            planSuscripcion: true,
          },
        },
      },
    });

    if (!usuario) {
      throw new NotFoundException(`No existe un usuario con el ID ${id}.`);
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id);

    if (updateUsuarioDto.correo !== undefined) {
      const usuarioConCorreo = await this.prisma.usuario.findFirst({
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
      const usuarioConTelefono = await this.prisma.usuario.findFirst({
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

    return this.prisma.usuario.update({
      where: {
        IdUsuario: id,
      },
      data: updateUsuarioDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.usuario.delete({
      where: {
        IdUsuario: id,
      },
    });
  }
}
