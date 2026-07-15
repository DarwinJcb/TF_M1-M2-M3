/* tf_m1-m2-m3/src/suscripciones/suscripciones.controller.ts */
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
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';
import { UpdateSuscripcionDto } from './dto/update-suscripcion.dto';
import { SuscripcionesService } from './suscripciones.service';

@Controller('suscripciones')
export class SuscripcionesController {
  constructor(private readonly suscripcionesService: SuscripcionesService) {}

  @Post()
  create(@Body() createSuscripcionDto: CreateSuscripcionDto) {
    return this.suscripcionesService.create(createSuscripcionDto);
  }

  @Get()
  findAll() {
    return this.suscripcionesService.findAll();
  }

  @Get('usuario/:idUsuario')
  findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.suscripcionesService.findByUsuario(idUsuario);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.suscripcionesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSuscripcionDto: UpdateSuscripcionDto,
  ) {
    return this.suscripcionesService.update(id, updateSuscripcionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.suscripcionesService.remove(id);
  }
}
