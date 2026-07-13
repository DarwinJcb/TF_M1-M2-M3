/* src/reportes/reportes.service.ts: */
import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaInteraccionesService } from '../prisma-interacciones/prisma-interacciones.service';
import { PrismaUsuariosService } from '../prisma-usuarios/prisma-usuarios.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';

@Injectable()
export class ReportesService {
  constructor(
    private readonly prismaInteracciones: PrismaInteraccionesService,
    private readonly prismaUsuarios: PrismaUsuariosService,
  ) { }

  async create(createReporteDto: CreateReporteDto) {
    const {
      UsuarioReportanteFK,
      UsuarioReportadoFK,
    } = createReporteDto;

    this.verificarUsuariosDiferentes(
      UsuarioReportanteFK,
      UsuarioReportadoFK,
    );

    const [usuarioReportante, usuarioReportado] =
      await Promise.all([
        this.obtenerUsuario(UsuarioReportanteFK),
        this.obtenerUsuario(UsuarioReportadoFK),
      ]);

    const reporte =
      await this.prismaInteracciones.reporte.create({
        data: createReporteDto,
      });

    return {
      ...reporte,
      usuarioReportante,
      usuarioReportado,
    };
  }

  async findAll() {
    const reportes =
      await this.prismaInteracciones.reporte.findMany({
        orderBy: {
          fechaReporte: 'desc',
        },
      });

    if (reportes.length === 0) {
      return [];
    }

    const usuariosPorId =
      await this.obtenerUsuariosPorIds(
        reportes.flatMap((reporte) => [
          reporte.UsuarioReportanteFK,
          reporte.UsuarioReportadoFK,
        ]),
      );

    return reportes.map((reporte) => ({
      ...reporte,
      usuarioReportante:
        usuariosPorId.get(
          reporte.UsuarioReportanteFK,
        ) ?? null,
      usuarioReportado:
        usuariosPorId.get(
          reporte.UsuarioReportadoFK,
        ) ?? null,
    }));
  }

  async findByReportante(idUsuario: number) {
    const usuarioReportante =
      await this.obtenerUsuario(idUsuario);

    const reportes =
      await this.prismaInteracciones.reporte.findMany({
        where: {
          UsuarioReportanteFK: idUsuario,
        },
        orderBy: {
          fechaReporte: 'desc',
        },
      });

    const usuariosPorId =
      await this.obtenerUsuariosPorIds(
        reportes.map(
          (reporte) => reporte.UsuarioReportadoFK,
        ),
      );

    return reportes.map((reporte) => ({
      ...reporte,
      usuarioReportante,
      usuarioReportado:
        usuariosPorId.get(
          reporte.UsuarioReportadoFK,
        ) ?? null,
    }));
  }

  async findByReportado(idUsuario: number) {
    const usuarioReportado =
      await this.obtenerUsuario(idUsuario);

    const reportes =
      await this.prismaInteracciones.reporte.findMany({
        where: {
          UsuarioReportadoFK: idUsuario,
        },
        orderBy: {
          fechaReporte: 'desc',
        },
      });

    const usuariosPorId =
      await this.obtenerUsuariosPorIds(
        reportes.map(
          (reporte) =>
            reporte.UsuarioReportanteFK,
        ),
      );

    return reportes.map((reporte) => ({
      ...reporte,
      usuarioReportante:
        usuariosPorId.get(
          reporte.UsuarioReportanteFK,
        ) ?? null,
      usuarioReportado,
    }));
  }

  async findOne(id: number) {
    const reporte = await this.obtenerReporte(id);

    const [usuarioReportante, usuarioReportado] =
      await Promise.all([
        this.obtenerUsuario(
          reporte.UsuarioReportanteFK,
        ),
        this.obtenerUsuario(
          reporte.UsuarioReportadoFK,
        ),
      ]);

    return {
      ...reporte,
      usuarioReportante,
      usuarioReportado,
    };
  }

  async update(
    id: number,
    updateReporteDto: UpdateReporteDto,
  ) {
    const reporteActual =
      await this.obtenerReporte(id);

    const idUsuarioReportante =
      updateReporteDto.UsuarioReportanteFK ??
      reporteActual.UsuarioReportanteFK;

    const idUsuarioReportado =
      updateReporteDto.UsuarioReportadoFK ??
      reporteActual.UsuarioReportadoFK;

    this.verificarUsuariosDiferentes(
      idUsuarioReportante,
      idUsuarioReportado,
    );

    const [usuarioReportante, usuarioReportado] =
      await Promise.all([
        this.obtenerUsuario(idUsuarioReportante),
        this.obtenerUsuario(idUsuarioReportado),
      ]);

    const reporteActualizado =
      await this.prismaInteracciones.reporte.update({
        where: {
          IdReporte: id,
        },
        data: updateReporteDto,
      });

    return {
      ...reporteActualizado,
      usuarioReportante,
      usuarioReportado,
    };
  }

  async remove(id: number) {
    await this.obtenerReporte(id);

    return this.prismaInteracciones.reporte.delete({
      where: {
        IdReporte: id,
      },
    });
  }

  private async obtenerReporte(idReporte: number) {
    const reporte =
      await this.prismaInteracciones.reporte.findUnique({
        where: {
          IdReporte: idReporte,
        },
      });

    if (!reporte) {
      throw new NotFoundException(
        `No existe un reporte con el ID ${idReporte}.`,
      );
    }

    return reporte;
  }

  private async obtenerUsuario(idUsuario: number) {
    const usuario =
      await this.prismaUsuarios.usuario.findUnique({
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

  private async obtenerUsuariosPorIds(
    idsUsuarios: number[],
  ) {
    const identificadoresUnicos = [
      ...new Set(idsUsuarios),
    ];

    const usuarios =
      await this.prismaUsuarios.usuario.findMany({
        where: {
          IdUsuario: {
            in: identificadoresUnicos,
          },
        },
      });

    return new Map(
      usuarios.map((usuario) => [
        usuario.IdUsuario,
        usuario,
      ]),
    );
  }

  private verificarUsuariosDiferentes(
    idUsuarioReportante: number,
    idUsuarioReportado: number,
  ): void {
    if (
      idUsuarioReportante === idUsuarioReportado
    ) {
      throw new BadRequestException(
        'Un usuario no puede reportarse a sí mismo.',
      );
    }
  }
}