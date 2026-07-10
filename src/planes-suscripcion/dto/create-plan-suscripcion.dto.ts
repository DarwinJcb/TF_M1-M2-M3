/* src/planes-suscripcion/dto/create-plan-suscripcion.dto.ts: */
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TipoPlan } from '../../generated/prisma/enums';

export class CreatePlanSuscripcionDto {
  @IsEnum(TipoPlan)
  tipoPlan: TipoPlan;

  @IsNumber()
  @Min(0)
  valor: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  contenido?: string;

  @IsOptional()
  @IsBoolean()
  mensajesIlimitados?: boolean;
}
