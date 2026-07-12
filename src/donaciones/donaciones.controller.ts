/* src/donaciones/donaciones.controller.ts: */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DonacionesService } from './donaciones.service';
import { CreateDonacionDto } from './dto/create-donacion.dto';
import { UpdateDonacionDto } from './dto/update-donacion.dto';

@Controller('donaciones')
export class DonacionesController {
  constructor(private readonly donacionesService: DonacionesService) {}

  @Post()
  create(@Body() createDonacionDto: CreateDonacionDto) {
    return this.donacionesService.create(createDonacionDto);
  }

  @Get()
  findAll() {
    return this.donacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donacionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonacionDto: UpdateDonacionDto) {
    return this.donacionesService.update(+id, updateDonacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donacionesService.remove(+id);
  }
}
