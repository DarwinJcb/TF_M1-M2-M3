/* src/restricciones/dto/create-restriccion.dto.ts: */
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRestriccionDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsOptional()
  @IsInt()
  PlanSuscripcionFK?: number;
}
