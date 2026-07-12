/* src/suscripciones/dto/create-suscripcion.dto.ts: */
import { IsInt } from 'class-validator';

export class CreateSuscripcionDto {
  @IsInt()
  UsuarioFK: number;

  @IsInt()
  PlanSuscripcionFK: number;
}
