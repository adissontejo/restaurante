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
import { FuncionarioService } from './funcionario.service';
import { CreateFuncionarioDTO } from './dtos/create-funcionario.dto';
import { CreateFuncionarioValidator } from './validators/create-funcionario.validator';
import { UpdateFuncionarioDTO } from './dtos/update-funcionario.dto';
import { UpdateFuncionarioValidator } from './validators/update-funcionario-validator';
import { FuncionarioMapper } from './mappers/funcionario.mapper';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/funcionarios')
export class FuncionarioController {
  constructor(private readonly service: FuncionarioService) {}

  @Post()
  async create(
    @Body(CreateFuncionarioValidator) data: CreateFuncionarioDTO
  ) {
    const funcionario = await this.service.create(data);

    return FuncionarioMapper.fromEntityToResponseDTO(funcionario);
  }

  @Get()
  async list() {
    const funcionarios = await this.service.list();

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
    @Body(UpdateFuncionarioValidator) data:UpdateFuncionarioDTO
  ) {
    const funcionario = await this.service.updateById(id, {
      ...data
    });

    return FuncionarioMapper.fromEntityToResponseDTO(funcionario);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.deleteById(id);
  }
}
