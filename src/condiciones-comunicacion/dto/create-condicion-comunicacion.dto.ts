/* tf_m1-m2-m3/src/condiciones-comunicacion/dto/create-condicion-comunicacion.dto.ts */
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCondicionComunicacionDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;
}
