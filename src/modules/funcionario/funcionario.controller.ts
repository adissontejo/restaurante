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
import { FuncionarioService } from './funcionario.service';
import { CreateFuncionarioDTO } from './dtos/create-funcionario.dto';
import { CreateFuncionarioValidator } from './validators/create-funcionario.validator';
import { UpdateFuncionarioDTO } from './dtos/update-funcionario.dto';
import { UpdateFuncionarioValidator } from './validators/update-funcionario-validator';
import { FuncionarioMapper } from './mappers/funcionario.mapper';

@Controller('/funcionarios')
export class FuncionarioController {
  constructor(private readonly service: FuncionarioService) {}

  @Post()
  async create(@Body(CreateFuncionarioValidator) data: CreateFuncionarioDTO) {
    const funcionario = await this.service.create(data);

    return FuncionarioMapper.fromEntityToResponseDTO(funcionario);
  }

  @Get()
  async list(
    @Query('restauranteId', ParseIntPipe) restauranteId: number,
    @Query('usuarioId', new ParseIntPipe({ optional: true }))
    usuarioId?: number,
  ) {
    const funcionarios = await this.service.list(restauranteId, usuarioId);

    return funcionarios.map(FuncionarioMapper.fromEntityToResponseDTO);
  }

  @Get('/:id')
  async get(@Param('id', ParseIntPipe) id: number) {
    const funcionario = await this.service.getById(id);

    return FuncionarioMapper.fromEntityToResponseDTO(funcionario);
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(UpdateFuncionarioValidator) data: UpdateFuncionarioDTO,
  ) {
    const funcionario = await this.service.updateById(id, {
      ...data,
    });

    return FuncionarioMapper.fromEntityToResponseDTO(funcionario);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.deleteById(id);
  }
}
