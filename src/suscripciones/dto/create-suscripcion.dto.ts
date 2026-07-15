/* tf_m1-m2-m3/src/suscripciones/dto/create-suscripcion.dto.ts */
import { IsInt } from 'class-validator';

export class CreateSuscripcionDto {
  @IsInt()
  UsuarioFK: number;

  @IsInt()
  PlanSuscripcionFK: number;
}
