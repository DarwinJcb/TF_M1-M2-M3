/* src/reportes/reportes.service.ts: */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';

@Injectable()
export class ReportesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReporteDto: CreateReporteDto) {
    const { UsuarioReportanteFK, UsuarioReportadoFK } = createReporteDto;

    this.verificarUsuariosDiferentes(UsuarioReportanteFK, UsuarioReportadoFK);

    await this.verificarUsuario(UsuarioReportanteFK);
    await this.verificarUsuario(UsuarioReportadoFK);

    return this.prisma.reporte.create({
      data: createReporteDto,
      include: {
        usuarioReportante: true,
        usuarioReportado: true,
      },
    });
  }

  findAll() {
    return this.prisma.reporte.findMany({
      include: {
        usuarioReportante: true,
        usuarioReportado: true,
      },
      orderBy: {
        fechaReporte: 'desc',
      },
    });
  }

  async findByReportante(idUsuario: number) {
    await this.verificarUsuario(idUsuario);

    return this.prisma.reporte.findMany({
      where: {
        UsuarioReportanteFK: idUsuario,
      },
      include: {
        usuarioReportado: true,
      },
      orderBy: {
        fechaReporte: 'desc',
      },
    });
  }

  async findByReportado(idUsuario: number) {
    await this.verificarUsuario(idUsuario);

    return this.prisma.reporte.findMany({
      where: {
        UsuarioReportadoFK: idUsuario,
      },
      include: {
        usuarioReportante: true,
      },
      orderBy: {
        fechaReporte: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const reporte = await this.prisma.reporte.findUnique({
      where: {
        IdReporte: id,
      },
      include: {
        usuarioReportante: true,
        usuarioReportado: true,
      },
    });

    if (!reporte) {
      throw new NotFoundException(`No existe un reporte con el ID ${id}.`);
    }

    return reporte;
  }

  async update(id: number, updateReporteDto: UpdateReporteDto) {
    const reporteActual = await this.findOne(id);

    const idUsuarioReportante =
      updateReporteDto.UsuarioReportanteFK ?? reporteActual.UsuarioReportanteFK;

    const idUsuarioReportado =
      updateReporteDto.UsuarioReportadoFK ?? reporteActual.UsuarioReportadoFK;

    this.verificarUsuariosDiferentes(idUsuarioReportante, idUsuarioReportado);

    await this.verificarUsuario(idUsuarioReportante);
    await this.verificarUsuario(idUsuarioReportado);

    return this.prisma.reporte.update({
      where: {
        IdReporte: id,
      },
      data: updateReporteDto,
      include: {
        usuarioReportante: true,
        usuarioReportado: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.reporte.delete({
      where: {
        IdReporte: id,
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
    idUsuarioReportante: number,
    idUsuarioReportado: number,
  ): void {
    if (idUsuarioReportante === idUsuarioReportado) {
      throw new BadRequestException(
        'Un usuario no puede reportarse a sí mismo.',
      );
    }
  }
}
