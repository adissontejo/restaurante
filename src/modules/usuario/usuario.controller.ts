import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDTO } from './dtos/create-usuario.dto';
import { CreateUsuarioValidator } from './validators/create-usuario.validator';
import { UpdateUsuarioDTO } from './dtos/update-usuario.dto';
import { UpdateUsuarioValidator } from './validators/update-usuario-validator';
import { UsuarioMapper } from './mappers/usuario.mapper';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFilePipe } from 'src/components/image-file.pipe';

@Controller('/usuarios')
export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}

  @Post()
  @UseInterceptors(FileInterceptor('fotoPerfilUrl'))
  async create(
    @Body(CreateUsuarioValidator) data: Omit<CreateUsuarioDTO, 'fotoPerfilUrl'>,
    @UploadedFile(ImageFilePipe) fotoPerfilUrl?: Express.Multer.File,
  ) {
    const usuario = await this.service.create({
      ...data,
      fotoPerfilUrl,
    });

    return UsuarioMapper.fromEntityToResponseDTO(usuario);
  }

  @Get()
  async list() {
    const usuarios = await this.service.list();

    return usuarios.map(UsuarioMapper.fromEntityToResponseDTO);
  }

  @Get('/:id')
  async get(@Param('id', ParseIntPipe) id: number) {
    const usuario = await this.service.getById(id);

    return UsuarioMapper.fromEntityToResponseDTO(usuario);
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('fotoPerfilUrl'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(UpdateUsuarioValidator) data: Omit<UpdateUsuarioDTO, 'fotoPerfilUrl'>,
    @UploadedFile(ImageFilePipe) fotoPerfilUrl?: Express.Multer.File,
  ) {
    const usuario = await this.service.updateById(id, {
      ...data,
      fotoPerfilUrl,
    });

    return UsuarioMapper.fromEntityToResponseDTO(usuario);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.deleteById(id);
  }
}