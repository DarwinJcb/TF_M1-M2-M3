/* src/ventajas/ventajas.controller.ts: */
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
import { CreateVentajaDto } from './dto/create-ventaja.dto';
import { UpdateVentajaDto } from './dto/update-ventaja.dto';
import { VentajasService } from './ventajas.service';

@Controller('ventajas')
export class VentajasController {
  constructor(private readonly ventajasService: VentajasService) {}

  @Post()
  create(@Body() createVentajaDto: CreateVentajaDto) {
    return this.ventajasService.create(createVentajaDto);
  }

  @Get()
  findAll() {
    return this.ventajasService.findAll();
  }

  @Get('plan/:idPlanSuscripcion')
  findByPlan(
    @Param('idPlanSuscripcion', ParseIntPipe)
    idPlanSuscripcion: number,
  ) {
    return this.ventajasService.findByPlan(idPlanSuscripcion);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventajasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVentajaDto: UpdateVentajaDto,
  ) {
    return this.ventajasService.update(id, updateVentajaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ventajasService.remove(id);
  }
}
