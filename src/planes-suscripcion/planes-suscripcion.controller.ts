/* tf_m1-m2-m3/src/planes-suscripcion/planes-suscripcion.controller.ts */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePlanSuscripcionDto } from './dto/create-plan-suscripcion.dto';
import { UpdatePlanSuscripcionDto } from './dto/update-plan-suscripcion.dto';
import { PlanesSuscripcionService } from './planes-suscripcion.service';

@Controller('planes-suscripcion')
export class PlanesSuscripcionController {
  constructor(
    private readonly planesSuscripcionService: PlanesSuscripcionService,
  ) {}

  @Post()
  create(@Body() createPlanSuscripcionDto: CreatePlanSuscripcionDto) {
    return this.planesSuscripcionService.create(createPlanSuscripcionDto);
  }

  @Get()
  findAll() {
    return this.planesSuscripcionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.planesSuscripcionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanSuscripcionDto: UpdatePlanSuscripcionDto,
  ) {
    return this.planesSuscripcionService.update(id, updatePlanSuscripcionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.planesSuscripcionService.remove(id);
  }
}
