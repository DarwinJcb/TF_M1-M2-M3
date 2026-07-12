/* src/donaciones/donaciones.service.ts: */
import { Injectable } from '@nestjs/common';
import { CreateDonacionDto } from './dto/create-donacion.dto';
import { UpdateDonacionDto } from './dto/update-donacion.dto';

@Injectable()
export class DonacionesService {
  create(createDonacionDto: CreateDonacionDto) {
    return 'This action adds a new donacion';
  }

  findAll() {
    return `This action returns all donaciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} donacion`;
  }

  update(id: number, updateDonacionDto: UpdateDonacionDto) {
    return `This action updates a #${id} donacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} donacion`;
  }
}
