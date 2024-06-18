import { Injectable } from '@nestjs/common';
import { ContaRepository } from './conta.repository';
import { CreateContaDTO } from './dtos/create-conta.dto';
import { ContaMapper } from './mappers/conta.mapper';
import { UpdateContaDTO } from './dtos/update-conta.dto';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { Transaction } from 'src/decorators/transaction.decorator';
import { removeUndefinedAndAssign } from 'src/utils/object';
import { UsuarioService } from '../usuario/usuario.service';
import { RestauranteService } from '../restaurante/restaurante.service';
import { ContaWithRelations } from './conta.entity';

@Injectable()
export class ContaService {
  constructor(
        private readonly repository: ContaRepository,
        private readonly usarioService: UsuarioService,
        private readonly restauranteService: RestauranteService,
  ) {}

  @Transaction()
  async create(data: CreateContaDTO): Promise<ContaWithRelations> {

    const createData = ContaMapper.fromCreateDTOToEntity(data);

    if (!data.mes || !data.valorPago || !data.valorTotal || !data.restauranteId || !data.usuarioId) {
        throw new AppException(
          `Todos os campos obrigatórios devem ser fornecidos`,
          ExceptionType.INVALID_PARAMS,
        );
    }

    const usuario = await this.usarioService.getById(createData.usuario_id);
    await this.restauranteService.getById(createData.restaurante_id);
    await this.checkExistingContaMes(createData.usuario_id, createData.restaurante_id, createData.mes);

    const result = await this.repository.insert(createData);

    return {
      ...createData,
      id: result.insertId,
      usuario,
    };
  }

  async list() {
    const contas = await this.repository.findAll();

    return contas;
  }

  async getById(id: number) {
    const conta = await this.repository.getById(id);

    if (!conta) {
      throw new AppException(
        `Conta com id ${id} não encontrada`,
        ExceptionType.DATA_NOT_FOUND,
      );
    }

    return conta;
  }

  @Transaction()
  async updateById(
    id: number,
    data: UpdateContaDTO,
  ): Promise<ContaWithRelations> {
    const conta = await this.getById(id);
    const updateData = ContaMapper.fromUpdateDTOToEntity(data);
    let usuario = conta.usuario;

    if(updateData.usuario_id) usuario = await this.usarioService.getById(updateData.usuario_id);
    if(updateData.restaurante_id) await this.restauranteService.getById(updateData.restaurante_id);

    if(updateData.usuario_id && updateData.restaurante_id && updateData.mes
        && (updateData.usuario_id != conta.usuario_id ||
            updateData.restaurante_id != conta.restaurante_id ||
            updateData.mes != conta.mes)
    ){
        await this.checkExistingContaMes(updateData.usuario_id, updateData.restaurante_id, updateData.mes);
    }

    await this.repository.updateById(conta.id, updateData);

    removeUndefinedAndAssign(conta, updateData);

    return {
      ...conta,
      usuario
    };
  }

  @Transaction()
  async deleteById(id: number) {
    await this.repository.deleteById(id);
  }

  @Transaction()
  private async checkExistingContaMes(usuarioId: number, restauranteId: number, mes: number) {
    const existingConta = await this.repository.getByContaUsuarioMes(usuarioId, restauranteId, mes);

    if (existingConta) {
      throw new AppException(
        `Conta já existente no mes neste restaurante!`,
        ExceptionType.DATA_ALREADY_EXISTS,
      );
    }
  }
}
