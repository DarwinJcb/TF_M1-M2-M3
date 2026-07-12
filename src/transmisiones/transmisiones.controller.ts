/* src/transmisiones/transmisiones.controller.ts: */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransmisionesService } from './transmisiones.service';
import { CreateTransmisionDto } from './dto/create-transmision.dto';
import { UpdateTransmisionDto } from './dto/update-transmision.dto';

@Controller('transmisiones')
export class TransmisionesController {
  constructor(private readonly transmisionesService: TransmisionesService) { }

  @Post()
  create(@Body() createTransmisionDto: CreateTransmisionDto) {
    return this.transmisionesService.create(createTransmisionDto);
  }

  @Get()
  findAll() {
    return this.transmisionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transmisionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransmisionDto: UpdateTransmisionDto) {
    return this.transmisionesService.update(+id, updateTransmisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transmisionesService.remove(+id);
  }
}
