/* src/ventajas/ventajas.service.ts: */
import { Injectable } from '@nestjs/common';
import { CreateVentajaDto } from './dto/create-ventaja.dto';
import { UpdateVentajaDto } from './dto/update-ventaja.dto';

@Injectable()
export class VentajasService {
  create(createVentajaDto: CreateVentajaDto) {
    return 'This action adds a new ventaja';
  }

  findAll() {
    return `This action returns all ventajas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ventaja`;
  }

  update(id: number, updateVentajaDto: UpdateVentajaDto) {
    return `This action updates a #${id} ventaja`;
  }

  remove(id: number) {
    return `This action removes a #${id} ventaja`;
  }
}
