/* src/ventajas/ventajas.controller.ts: */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VentajasService } from './ventajas.service';
import { CreateVentajaDto } from './dto/create-ventaja.dto';
import { UpdateVentajaDto } from './dto/update-ventaja.dto';

@Controller('ventajas')
export class VentajasController {
  constructor(private readonly ventajasService: VentajasService) { }

  @Post()
  create(@Body() createVentajaDto: CreateVentajaDto) {
    return this.ventajasService.create(createVentajaDto);
  }

  @Get()
  findAll() {
    return this.ventajasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventajasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVentajaDto: UpdateVentajaDto) {
    return this.ventajasService.update(+id, updateVentajaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ventajasService.remove(+id);
  }
}
