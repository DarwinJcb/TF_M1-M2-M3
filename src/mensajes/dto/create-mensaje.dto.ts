/* src/mensajes/dto/create-mensaje.dto.ts: */
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMensajeDto {
  @IsString()
  @IsNotEmpty()
  contenido: string;

  @IsInt()
  ChatFK: number;

  @IsInt()
  UsuarioEmisorFK: number;
}
