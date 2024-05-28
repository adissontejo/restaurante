import { Body, Controller, Get, Post } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { CreateRestauranteDTO } from './dtos/CreateRestauranteDTO';

@Controller('/restaurantes')
export class RestauranteController {
  constructor(private readonly service: RestauranteService) {}

  @Post()
  async create(@Body() data: CreateRestauranteDTO) {
    const restaurante = await this.service.create(data);

    return restaurante;
  }

  @Get()
  async list() {
    const restaurantes = await this.service.list();

    return restaurantes;
  }
}
