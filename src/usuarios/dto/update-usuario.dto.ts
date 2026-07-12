/* src/usuarios/dto/update-usuario.dto.ts: */
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoActividad } from '../../generated/prisma/enums';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsOptional()
  @IsEnum(EstadoActividad)
  estadoActividad?: EstadoActividad;
}
