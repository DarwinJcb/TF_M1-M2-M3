/* src/usuarios/dto/create-usuario.dto.ts: */
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Genero } from '../../generated/prisma/enums';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsInt()
  edad: number;

  @IsOptional()
  @IsString()
  biografia?: string;

  @IsOptional()
  @IsNumber()
  peso?: number;

  @IsOptional()
  @IsNumber()
  altura?: number;

  @IsString()
  @IsNotEmpty()
  nacionalidad: string;

  @IsEnum(Genero)
  genero: Genero;

  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @IsString()
  @IsNotEmpty()
  pais: string;

  @IsString()
  @IsNotEmpty()
  numeroTelefono: string;

  @IsEmail()
  correo: string;
}
