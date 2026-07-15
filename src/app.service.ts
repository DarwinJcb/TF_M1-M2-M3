/* tf_m1-m2-m3/src/app.service.ts */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '¡Hola Mundo!';
  }
}
