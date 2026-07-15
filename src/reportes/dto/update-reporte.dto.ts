/* tf_m1-m2-m3/src/reportes/dto/update-reporte.dto.ts */
import { PartialType } from '@nestjs/mapped-types';
import { CreateReporteDto } from './create-reporte.dto';

export class UpdateReporteDto extends PartialType(CreateReporteDto) {}
