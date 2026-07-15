/* tf_m1-m2-m3/src/ubicaciones/dto/create-ubicacion.dto.ts */
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUbicacionDto {
  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @IsString()
  @IsNotEmpty()
  pais: string;

  @IsInt()
  UsuarioFK: number;
}
