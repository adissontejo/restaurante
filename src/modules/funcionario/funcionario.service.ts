import { Injectable } from '@nestjs/common';
import { FuncionarioRepository } from './funcionario.repository';
import { CreateFuncionarioDTO } from './dtos/create-funcionario.dto';
import { FuncionarioMapper } from './mappers/funcionario.mapper';
import { UpdateFuncionarioDTO } from './dtos/update-funcionario.dto';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { Transaction } from 'src/decorators/transaction.decorator';
import { removeUndefinedAndAssign } from 'src/utils/object';
import { UsuarioService } from '../usuario/usuario.service';
import { RestauranteService } from '../restaurante/restaurante.service';
import { FuncionarioWithRelations } from './funcionario.entity';

@Injectable()
export class FuncionarioService {
  constructor(
        private readonly repository: FuncionarioRepository,
        private readonly usarioService: UsuarioService,
        private readonly restauranteService: RestauranteService,
  ) {}

  @Transaction()
  async create(data: CreateFuncionarioDTO): Promise<FuncionarioWithRelations> {

    const createData = FuncionarioMapper.fromCreateDTOToEntity(data);

    if (!data.cargo || !data.restauranteId || !data.usuarioId) {
        throw new AppException(
          `Todos os campos obrigatórios devem ser fornecidos`,
          ExceptionType.INVALID_PARAMS,
        );
    }

    const usuario = await this.usarioService.getById(createData.usuario_id);
    await this.restauranteService.getById(createData.restaurante_id);
    await this.checkExistingFuncionarioInThisResturante(createData.usuario_id, createData.restaurante_id);

    const result = await this.repository.insert(createData);

    return {
      ...createData,
      id: result.insertId,
      usuario,
    };
  }

  async list() {
    const funcionarios = await this.repository.findAll();

    return funcionarios;
  }

  async getById(id: number) {
    const funcionario = await this.repository.getById(id);

    if (!funcionario) {
      throw new AppException(
        `Usuário com id ${id} não encontrado`,
        ExceptionType.DATA_NOT_FOUND,
      );
    }

    return funcionario;
  }

  @Transaction()
  async updateById(
    id: number,
    data: UpdateFuncionarioDTO,
  ): Promise<FuncionarioWithRelations> {
    const funcionario = await this.getById(id);
    const updateData = FuncionarioMapper.fromUpdateDTOToEntity(data);

    await this.repository.updateById(funcionario.id, updateData);

    removeUndefinedAndAssign(funcionario, updateData);

    return {
      ...funcionario
    };
  }

  @Transaction()
  async deleteById(id: number) {
    await this.repository.deleteById(id);
  }

  @Transaction()
  private async checkExistingFuncionarioInThisResturante(usuarioId: number, restauranteId: number) {
    const existingFuncionario = await this.repository.getByUsuarioRestaurante(usuarioId, restauranteId);

    if (existingFuncionario) {
      throw new AppException(
        `Funcionário já existente neste restaurante!`,
        ExceptionType.DATA_ALREADY_EXISTS,
      );
    }
  }
}
