/* src/suscripciones-usuarios/suscripciones-usuarios.controller.ts: */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SuscripcionesUsuariosService } from './suscripciones-usuarios.service';
import { CreateSuscripcionUsuarioDto } from './dto/create-suscripcion-usuario.dto';
import { UpdateSuscripcionUsuarioDto } from './dto/update-suscripcion-usuario.dto';

@Controller('suscripciones-usuarios')
export class SuscripcionesUsuariosController {
  constructor(private readonly suscripcionesUsuariosService: SuscripcionesUsuariosService) { }

  @Post()
  create(@Body() createSuscripcionUsuarioDto: CreateSuscripcionUsuarioDto) {
    return this.suscripcionesUsuariosService.create(createSuscripcionUsuarioDto);
  }

  @Get()
  findAll() {
    return this.suscripcionesUsuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suscripcionesUsuariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSuscripcionesUsuarioDto: UpdateSuscripcionUsuarioDto) {
    return this.suscripcionesUsuariosService.update(+id, updateSuscripcionesUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suscripcionesUsuariosService.remove(+id);
  }
}
