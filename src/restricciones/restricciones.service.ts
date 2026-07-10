import { Injectable } from '@nestjs/common';
import { CreateRestriccioneDto } from './dto/create-restriccion.dto';
import { UpdateRestriccioneDto } from './dto/update-restriccion.dto';

@Injectable()
export class RestriccionesService {
  create(createRestriccioneDto: CreateRestriccioneDto) {
    return 'This action adds a new restriccione';
  }

  findAll() {
    return `This action returns all restricciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} restriccione`;
  }

  update(id: number, updateRestriccioneDto: UpdateRestriccioneDto) {
    return `This action updates a #${id} restriccione`;
  }

  remove(id: number) {
    return `This action removes a #${id} restriccione`;
  }
}
