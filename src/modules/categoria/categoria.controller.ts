import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaValidator } from './validator/create-categoria.validator';
import { CreateCategoriaDTO } from './dtos/create-categoria.dto';
import { CategoriaMapper } from './mapper/categoria.mapper';
import { UpdateCategoriaValidator } from './validator/update-categoria.validator';
import { UpdateCategoriaDTO } from './dtos/update-categoria.dto';

@Controller('/categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  async create(@Body(CreateCategoriaValidator) data: CreateCategoriaDTO) {
    const categoria = await this.categoriaService.create(data);

    return CategoriaMapper.fromEntityToResponseDTO(categoria);
  }

  @Put('/:id')
  async update(
    @Body(UpdateCategoriaValidator) data: UpdateCategoriaDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const categoria = await this.categoriaService.updateById(id, data);

    return CategoriaMapper.fromEntityToResponseDTO(categoria);
  }

  @Get()
  async list(@Query('restauranteId', ParseIntPipe) restauranteId: number) {
    const categorias = await this.categoriaService.list(restauranteId);

    return categorias.map(CategoriaMapper.fromEntityToResponseDTO);
  }

  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const categoria = await this.categoriaService.getById(id);

    return CategoriaMapper.fromEntityToResponseDTO(categoria);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.categoriaService.deleteById(id);
  }
}
