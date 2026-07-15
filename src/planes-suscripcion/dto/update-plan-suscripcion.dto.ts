/* tf_m1-m2-m3/src/planes-suscripcion/dto/update-plan-suscripcion.dto.ts */
import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanSuscripcionDto } from './create-plan-suscripcion.dto';

export class UpdatePlanSuscripcionDto extends PartialType(
  CreatePlanSuscripcionDto,
) {}
