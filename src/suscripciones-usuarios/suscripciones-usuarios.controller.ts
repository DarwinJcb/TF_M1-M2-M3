/* src/suscripciones-usuarios/suscripciones-usuarios.controller.ts: */
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
import { CreateSuscripcionUsuarioDto } from './dto/create-suscripcion-usuario.dto';
import { UpdateSuscripcionUsuarioDto } from './dto/update-suscripcion-usuario.dto';
import { SuscripcionesUsuariosService } from './suscripciones-usuarios.service';

@Controller('suscripciones-usuarios')
export class SuscripcionesUsuariosController {
  constructor(
    private readonly suscripcionesUsuariosService: SuscripcionesUsuariosService,
  ) { }

  @Post()
  create(
    @Body() createSuscripcionUsuarioDto: CreateSuscripcionUsuarioDto,
  ) {
    return this.suscripcionesUsuariosService.create(
      createSuscripcionUsuarioDto,
    );
  }

  @Get()
  findAll() {
    return this.suscripcionesUsuariosService.findAll();
  }

  @Get('usuario/:idUsuario')
  findByUsuario(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
  ) {
    return this.suscripcionesUsuariosService.findByUsuario(idUsuario);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.suscripcionesUsuariosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSuscripcionUsuarioDto: UpdateSuscripcionUsuarioDto,
  ) {
    return this.suscripcionesUsuariosService.update(
      id,
      updateSuscripcionUsuarioDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.suscripcionesUsuariosService.remove(id);
  }
}