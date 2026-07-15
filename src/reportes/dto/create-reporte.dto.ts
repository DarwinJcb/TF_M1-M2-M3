/* tf_m1-m2-m3/src/reportes/dto/create-reporte.dto.ts */
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateReporteDto {
  @IsString()
  @IsNotEmpty()
  motivo: string;

  @IsInt()
  UsuarioReportanteFK: number;

  @IsInt()
  UsuarioReportadoFK: number;
}
