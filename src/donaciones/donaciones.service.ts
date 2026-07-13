/* src/donaciones/donaciones.service.ts: */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoTransmision } from '../generated/prisma-usuarios/enums';
import { PrismaUsuariosService } from '../prisma-usuarios/prisma-usuarios.service';
import { CreateDonacionDto } from './dto/create-donacion.dto';
import { UpdateDonacionDto } from './dto/update-donacion.dto';

@Injectable()
export class DonacionesService {
  constructor(
    private readonly prismaUsuarios: PrismaUsuariosService,
  ) {}

  async create(createDonacionDto: CreateDonacionDto) {
    const { UsuarioDonanteFK, UsuarioReceptorFK, TransmisionFK } =
      createDonacionDto;

    this.verificarUsuariosDiferentes(
      UsuarioDonanteFK,
      UsuarioReceptorFK,
    );

    await this.verificarUsuario(UsuarioDonanteFK);
    await this.verificarUsuario(UsuarioReceptorFK);

    if (TransmisionFK !== undefined) {
      await this.verificarTransmisionParaDonacion(
        TransmisionFK,
        UsuarioReceptorFK,
      );
    }

    return this.prismaUsuarios.donacion.create({
      data: createDonacionDto,
      include: {
        usuarioDonante: true,
        usuarioReceptor: true,
        transmision: true,
      },
    });
  }

  findAll() {
    return this.prismaUsuarios.donacion.findMany({
      include: {
        usuarioDonante: true,
        usuarioReceptor: true,
        transmision: true,
      },
      orderBy: {
        fechaDonacion: 'desc',
      },
    });
  }

  async findByDonante(idUsuario: number) {
    await this.verificarUsuario(idUsuario);

    return this.prismaUsuarios.donacion.findMany({
      where: {
        UsuarioDonanteFK: idUsuario,
      },
      include: {
        usuarioReceptor: true,
        transmision: true,
      },
      orderBy: {
        fechaDonacion: 'desc',
      },
    });
  }

  async findByReceptor(idUsuario: number) {
    await this.verificarUsuario(idUsuario);

    return this.prismaUsuarios.donacion.findMany({
      where: {
        UsuarioReceptorFK: idUsuario,
      },
      include: {
        usuarioDonante: true,
        transmision: true,
      },
      orderBy: {
        fechaDonacion: 'desc',
      },
    });
  }

  async findByTransmision(idTransmision: number) {
    await this.verificarTransmision(idTransmision);

    return this.prismaUsuarios.donacion.findMany({
      where: {
        TransmisionFK: idTransmision,
      },
      include: {
        usuarioDonante: true,
        usuarioReceptor: true,
      },
      orderBy: {
        fechaDonacion: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const donacion =
      await this.prismaUsuarios.donacion.findUnique({
        where: {
          IdDonacion: id,
        },
        include: {
          usuarioDonante: true,
          usuarioReceptor: true,
          transmision: true,
        },
      });

    if (!donacion) {
      throw new NotFoundException(
        `No existe una donación con el ID ${id}.`,
      );
    }

    return donacion;
  }

  async update(
    id: number,
    updateDonacionDto: UpdateDonacionDto,
  ) {
    const donacionActual = await this.findOne(id);

    const idUsuarioDonante =
      updateDonacionDto.UsuarioDonanteFK ??
      donacionActual.UsuarioDonanteFK;

    const idUsuarioReceptor =
      updateDonacionDto.UsuarioReceptorFK ??
      donacionActual.UsuarioReceptorFK;

    const idTransmision =
      updateDonacionDto.TransmisionFK ??
      donacionActual.TransmisionFK;

    this.verificarUsuariosDiferentes(
      idUsuarioDonante,
      idUsuarioReceptor,
    );

    await this.verificarUsuario(idUsuarioDonante);
    await this.verificarUsuario(idUsuarioReceptor);

    if (idTransmision !== null) {
      await this.verificarTransmisionParaDonacion(
        idTransmision,
        idUsuarioReceptor,
      );
    }

    return this.prismaUsuarios.donacion.update({
      where: {
        IdDonacion: id,
      },
      data: updateDonacionDto,
      include: {
        usuarioDonante: true,
        usuarioReceptor: true,
        transmision: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prismaUsuarios.donacion.delete({
      where: {
        IdDonacion: id,
      },
    });
  }

  private async verificarUsuario(
    idUsuario: number,
  ): Promise<void> {
    const usuario =
      await this.prismaUsuarios.usuario.findUnique({
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

  private async verificarTransmision(
    idTransmision: number,
  ): Promise<void> {
    const transmision =
      await this.prismaUsuarios.transmision.findUnique({
        where: {
          IdTransmision: idTransmision,
        },
        select: {
          IdTransmision: true,
        },
      });

    if (!transmision) {
      throw new NotFoundException(
        `No existe una transmisión con el ID ${idTransmision}.`,
      );
    }
  }

  private async verificarTransmisionParaDonacion(
    idTransmision: number,
    idUsuarioReceptor: number,
  ): Promise<void> {
    const transmision =
      await this.prismaUsuarios.transmision.findUnique({
        where: {
          IdTransmision: idTransmision,
        },
        select: {
          estado: true,
          UsuarioFK: true,
        },
      });

    if (!transmision) {
      throw new NotFoundException(
        `No existe una transmisión con el ID ${idTransmision}.`,
      );
    }

    if (transmision.estado !== EstadoTransmision.LIVE) {
      throw new BadRequestException(
        'Solo se pueden registrar donaciones en transmisiones LIVE.',
      );
    }

    if (transmision.UsuarioFK !== idUsuarioReceptor) {
      throw new BadRequestException(
        'El usuario receptor no es el propietario de la transmisión.',
      );
    }
  }

  private verificarUsuariosDiferentes(
    idUsuarioDonante: number,
    idUsuarioReceptor: number,
  ): void {
    if (idUsuarioDonante === idUsuarioReceptor) {
      throw new BadRequestException(
        'Un usuario no puede realizarse una donación a sí mismo.',
      );
    }
  }
}