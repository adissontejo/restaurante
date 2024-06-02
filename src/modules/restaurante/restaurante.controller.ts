import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { CreateRestauranteDTO } from './dtos/create-restaurante.dto';
import { RestauranteMapper } from './restaurante.mapper';
import { CreateRestauranteValidator } from './validators/create-restaurante.validator';
import { UpdateRestauranteDTO } from './dtos/update-restaurate.dto';
import { UpdateRestauranteValidator } from './validators/update-restaurante-validator';

@Controller('/restaurantes')
export class RestauranteController {
  constructor(private readonly service: RestauranteService) {}

  @Post()
  async create(@Body(CreateRestauranteValidator) data: CreateRestauranteDTO) {
    const restaurante = await this.service.create(data);

    return RestauranteMapper.fromEntityToResponseDTO(restaurante);
  }

  @Get()
  async list() {
    const restaurantes = await this.service.list();

    return restaurantes.map(RestauranteMapper.fromEntityToResponseDTO);
  }

  @Get('/:id')
  async get(@Param('id', ParseIntPipe) id: number) {
    const restaurante = await this.service.getById(id);

    return RestauranteMapper.fromEntityToResponseDTO(restaurante);
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(UpdateRestauranteValidator) data: UpdateRestauranteDTO,
  ) {
    const restaurante = await this.service.updateById(id, data);

    return RestauranteMapper.fromEntityToResponseDTO(restaurante);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.deleteById(id);
  }
}
