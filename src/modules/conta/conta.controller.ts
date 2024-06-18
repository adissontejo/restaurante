import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ContaService } from './conta.service';
import { CreateContaDTO } from './dtos/create-conta.dto';
import { CreateContaValidator } from './validators/create-conta.validator';
import { UpdateContaDTO } from './dtos/update-conta.dto';
import { UpdateContaValidator } from './validators/update-conta-validator';
import { ContaMapper } from './mappers/conta.mapper';

@Controller('/contas')
export class ContaController {
  constructor(private readonly service: ContaService) {}

  @Post()
  async create(
    @Body(CreateContaValidator) data: CreateContaDTO
  ) {
    const conta = await this.service.create(data);

    return ContaMapper.fromEntityToResponseDTO(conta);
  }

  @Get()
  async list() {
    const contas = await this.service.list();

    return contas.map(ContaMapper.fromEntityToResponseDTO);
  }

  @Get('/:id')
  async get(@Param('id', ParseIntPipe) id: number) {
    const conta = await this.service.getById(id);

    return ContaMapper.fromEntityToResponseDTO(conta);
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(UpdateContaValidator) data: UpdateContaDTO
  ) {
    const conta = await this.service.updateById(id, {
      ...data
    });

    return ContaMapper.fromEntityToResponseDTO(conta);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.deleteById(id);
  }
}
