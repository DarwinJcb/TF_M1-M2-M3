import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RestriccionesService } from './restricciones.service';
import { CreateRestriccioneDto } from './dto/create-restriccion.dto';
import { UpdateRestriccioneDto } from './dto/update-restriccion.dto';

@Controller('restricciones')
export class RestriccionesController {
  constructor(private readonly restriccionesService: RestriccionesService) {}

  @Post()
  create(@Body() createRestriccioneDto: CreateRestriccioneDto) {
    return this.restriccionesService.create(createRestriccioneDto);
  }

  @Get()
  findAll() {
    return this.restriccionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restriccionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRestriccioneDto: UpdateRestriccioneDto) {
    return this.restriccionesService.update(+id, updateRestriccioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restriccionesService.remove(+id);
  }
}
