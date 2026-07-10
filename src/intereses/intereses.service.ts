/* src/intereses/intereses.service.ts */
import { Injectable } from '@nestjs/common';
import { CreateInteresDto } from './dto/create-interes.dto';
import { UpdateInteresDto } from './dto/update-interes.dto';

@Injectable()
export class InteresesService {
  create(createInteresDto: CreateInteresDto) {
    return 'This action adds a new interes';
  }

  findAll() {
    return `This action returns all intereses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} interes`;
  }

  update(id: number, updateInteresDto: UpdateInteresDto) {
    return `This action updates a #${id} interes`;
  }

  remove(id: number) {
    return `This action removes a #${id} interes`;
  }
}
