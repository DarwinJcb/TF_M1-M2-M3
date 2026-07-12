/* src/condiciones-comunicacion/condiciones-comunicacion.controller.ts: */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CondicionesComunicacionService } from './condiciones-comunicacion.service';
import { CreateCondicionComunicacionDto } from './dto/create-condicion-comunicacion.dto';
import { UpdateCondicionComunicacionDto } from './dto/update-condicion-comunicacion.dto';

@Controller('condiciones-comunicacion')
export class CondicionesComunicacionController {
  constructor(private readonly condicionesComunicacionService: CondicionesComunicacionService) { }

  @Post()
  create(@Body() createCondicionComunicacionDto: CreateCondicionComunicacionDto) {
    return this.condicionesComunicacionService.create(createCondicionComunicacionDto);
  }

  @Get()
  findAll() {
    return this.condicionesComunicacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.condicionesComunicacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCondicionComunicacionDto: UpdateCondicionComunicacionDto) {
    return this.condicionesComunicacionService.update(+id, updateCondicionComunicacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.condicionesComunicacionService.remove(+id);
  }
}
