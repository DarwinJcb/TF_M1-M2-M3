/* src/matches/dto/create-match.dto.ts: */
import { IsInt } from 'class-validator';

export class CreateMatchDto {
  @IsInt()
  UsuarioUnoFK: number;

  @IsInt()
  UsuarioDosFK: number;
}
