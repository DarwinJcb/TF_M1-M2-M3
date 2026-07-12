/* src/pagos/dto/create-pago.dto.ts: */
import { IsInt, IsNumber, Min } from 'class-validator';

export class CreatePagoDto {
  @IsNumber()
  @Min(0.01)
  monto: number;

  @IsInt()
  SuscripcionFK: number;
}
