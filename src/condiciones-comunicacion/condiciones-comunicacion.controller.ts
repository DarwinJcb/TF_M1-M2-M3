/* src/condiciones-comunicacion/condiciones-comunicacion.controller.ts: */
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
import { CreateCondicionComunicacionDto } from './dto/create-condicion-comunicacion.dto';
import { UpdateCondicionComunicacionDto } from './dto/update-condicion-comunicacion.dto';
import { CondicionesComunicacionService } from './condiciones-comunicacion.service';

@Controller('condiciones-comunicacion')
export class CondicionesComunicacionController {
  constructor(
    private readonly condicionesComunicacionService: CondicionesComunicacionService,
  ) {}

  @Post()
  create(
    @Body()
    createCondicionComunicacionDto: CreateCondicionComunicacionDto,
  ) {
    return this.condicionesComunicacionService.create(
      createCondicionComunicacionDto,
    );
  }

  @Get()
  findAll() {
    return this.condicionesComunicacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.condicionesComunicacionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateCondicionComunicacionDto: UpdateCondicionComunicacionDto,
  ) {
    return this.condicionesComunicacionService.update(
      id,
      updateCondicionComunicacionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.condicionesComunicacionService.remove(id);
  }
}
