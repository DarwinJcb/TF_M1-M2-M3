/* tf_m1-m2-m3/src/mensajes/dto/update-mensaje.dto.ts */
import { PartialType } from '@nestjs/mapped-types';
import { CreateMensajeDto } from './create-mensaje.dto';

export class UpdateMensajeDto extends PartialType(CreateMensajeDto) {}
