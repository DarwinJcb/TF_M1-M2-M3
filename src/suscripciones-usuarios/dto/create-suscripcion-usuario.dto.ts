/* src/suscripciones-usuarios/dto/create-suscripcion-usuario.dto.ts: */
import { IsInt } from 'class-validator';

export class CreateSuscripcionUsuarioDto {
    @IsInt()
    UsuarioFK: number;

    @IsInt()
    PlanSuscripcionFK: number;
}