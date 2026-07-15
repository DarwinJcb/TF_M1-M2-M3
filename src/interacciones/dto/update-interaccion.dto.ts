/* tf_m1-m2-m3/src/interacciones/dto/update-interaccion.dto.ts */
import { PartialType } from '@nestjs/mapped-types';
import { CreateInteraccionDto } from './create-interaccion.dto';

export class UpdateInteraccionDto extends PartialType(CreateInteraccionDto) {}
