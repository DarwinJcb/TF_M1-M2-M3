/* src/ventajas/dto/update-ventaja.dto.ts: */
import { PartialType } from '@nestjs/mapped-types';
import { CreateVentajaDto } from './create-ventaja.dto';

export class UpdateVentajaDto extends PartialType(CreateVentajaDto) {}
