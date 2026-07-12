/* src/interacciones/interacciones.controller.ts: */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InteraccionesService } from './interacciones.service';
import { CreateInteraccionDto } from './dto/create-interaccion.dto';
import { UpdateInteraccionDto } from './dto/update-interaccion.dto';

@Controller('interacciones')
export class InteraccionesController {
  constructor(private readonly interaccionesService: InteraccionesService) { }

  @Post()
  create(@Body() createInteraccionDto: CreateInteraccionDto) {
    return this.interaccionesService.create(createInteraccionDto);
  }

  @Get()
  findAll() {
    return this.interaccionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interaccionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInteraccionDto: UpdateInteraccionDto) {
    return this.interaccionesService.update(+id, updateInteraccionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interaccionesService.remove(+id);
  }
}
