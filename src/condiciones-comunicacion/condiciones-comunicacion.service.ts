/* src/condiciones-comunicacion/condiciones-comunicacion.service.ts: */
import { Injectable } from '@nestjs/common';
import { CreateCondicionComunicacionDto } from './dto/create-condicion-comunicacion.dto';
import { UpdateCondicionComunicacionDto } from './dto/update-condicion-comunicacion.dto';

@Injectable()
export class CondicionesComunicacionService {
  create(createCondicionesComunicacionDto: CreateCondicionComunicacionDto) {
    return 'This action adds a new condicionComunicacion';
  }

  findAll() {
    return `This action returns all condicionComunicacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} condicionComunicacion`;
  }

  update(id: number, updateCondicionComunicacionDto: UpdateCondicionComunicacionDto) {
    return `This action updates a #${id} condicionComunicacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} condicionComunicacion`;
  }
}
