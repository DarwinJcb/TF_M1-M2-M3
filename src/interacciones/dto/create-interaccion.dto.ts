/* src/interacciones/dto/create-interaccion.dto.ts: */
import { IsEnum, IsInt } from 'class-validator';
import { TipoInteraccion } from '../../generated/prisma/enums';

export class CreateInteraccionDto {
  @IsEnum(TipoInteraccion)
  tipoInteraccion: TipoInteraccion;

  @IsInt()
  UsuarioEmisorFK: number;

  @IsInt()
  UsuarioReceptorFK: number;
}
