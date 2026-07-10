/* src/restricciones/restricciones.controller.ts: */
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
import { CreateRestriccionDto } from './dto/create-restriccion.dto';
import { UpdateRestriccionDto } from './dto/update-restriccion.dto';
import { RestriccionesService } from './restricciones.service';

@Controller('restricciones')
export class RestriccionesController {
  constructor(private readonly restriccionesService: RestriccionesService) {}

  @Post()
  create(@Body() createRestriccionDto: CreateRestriccionDto) {
    return this.restriccionesService.create(createRestriccionDto);
  }

  @Get()
  findAll() {
    return this.restriccionesService.findAll();
  }

  @Get('generales')
  findGenerales() {
    return this.restriccionesService.findGenerales();
  }

  @Get('plan/:idPlanSuscripcion')
  findByPlan(
    @Param('idPlanSuscripcion', ParseIntPipe)
    idPlanSuscripcion: number,
  ) {
    return this.restriccionesService.findByPlan(idPlanSuscripcion);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.restriccionesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRestriccionDto: UpdateRestriccionDto,
  ) {
    return this.restriccionesService.update(id, updateRestriccionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.restriccionesService.remove(id);
  }
}
