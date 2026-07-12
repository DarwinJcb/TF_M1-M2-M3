/* src/interacciones/interacciones.controller.ts: */
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
import { CreateInteraccionDto } from './dto/create-interaccion.dto';
import { UpdateInteraccionDto } from './dto/update-interaccion.dto';
import { InteraccionesService } from './interacciones.service';

@Controller('interacciones')
export class InteraccionesController {
  constructor(
    private readonly interaccionesService: InteraccionesService,
  ) { }

  @Post()
  create(@Body() createInteraccionDto: CreateInteraccionDto) {
    return this.interaccionesService.create(createInteraccionDto);
  }

  @Get()
  findAll() {
    return this.interaccionesService.findAll();
  }

  @Get('emisor/:idUsuario')
  findByEmisor(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
  ) {
    return this.interaccionesService.findByEmisor(idUsuario);
  }

  @Get('receptor/:idUsuario')
  findByReceptor(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
  ) {
    return this.interaccionesService.findByReceptor(idUsuario);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.interaccionesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInteraccionDto: UpdateInteraccionDto,
  ) {
    return this.interaccionesService.update(
      id,
      updateInteraccionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.interaccionesService.remove(id);
  }
}