/* src/restricciones/restricciones.service.ts: */
import { Injectable } from '@nestjs/common';
import { CreateRestriccionDto } from './dto/create-restriccion.dto';
import { UpdateRestriccionDto } from './dto/update-restriccion.dto';

@Injectable()
export class RestriccionesService {
  create(createRestriccioneDto: CreateRestriccionDto) {
    return 'This action adds a new restriccione';
  }

  findAll() {
    return `This action returns all restricciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} restriccione`;
  }

  update(id: number, updateRestriccioneDto: UpdateRestriccionDto) {
    return `This action updates a #${id} restriccione`;
  }

  remove(id: number) {
    return `This action removes a #${id} restriccione`;
  }
}
