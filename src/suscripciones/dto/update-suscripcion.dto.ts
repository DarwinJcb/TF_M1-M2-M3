/* tf_m1-m2-m3/src/suscripciones/dto/update-suscripcion.dto.ts */
import { PartialType } from '@nestjs/mapped-types';
import { CreateSuscripcionDto } from './create-suscripcion.dto';

export class UpdateSuscripcionDto extends PartialType(CreateSuscripcionDto) {}
