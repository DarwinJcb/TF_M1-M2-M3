/* src/planes-suscripcion/planes-suscripcion.service.ts: */
import { Injectable } from '@nestjs/common';
import { CreatePlanSuscripcionDto } from './dto/create-plan-suscripcion.dto';
import { UpdatePlanSuscripcionDto } from './dto/update-plan-suscripcion.dto';

@Injectable()
export class PlanesSuscripcionService {
  create(createPlanSuscripcionDto: CreatePlanSuscripcionDto) {
    return 'This action adds a new planSuscripcion';
  }

  findAll() {
    return `This action returns all planSuscripcion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planesSuscripcion`;
  }

  update(id: number, updatePlanesSuscripcionDto: UpdatePlanSuscripcionDto) {
    return `This action updates a #${id} planSuscripcion`;
  }

  remove(id: number) {
    return `This action removes a #${id} planSuscripcion`;
  }
}
