/* src/ventajas/dto/create-ventaja.dto.ts: */
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateVentajaDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsInt()
  PlanSuscripcionFK: number;
}
