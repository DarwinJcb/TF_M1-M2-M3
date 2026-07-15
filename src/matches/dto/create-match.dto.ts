/* tf_m1-m2-m3/src/matches/dto/create-match.dto.ts */
import { IsInt } from 'class-validator';

export class CreateMatchDto {
  @IsInt()
  UsuarioUnoFK: number;

  @IsInt()
  UsuarioDosFK: number;
}
