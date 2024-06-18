import { Injectable } from '@nestjs/common';
import { CupomRepository } from './cupom.repository';
import { CreateCupomDTO } from './dtos/create-cupom.dto';
import { CupomMapper } from './mappers/cupom.mapper';
import { UpdateCupomDTO } from './dtos/update-cupom.dto';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { Transaction } from 'src/decorators/transaction.decorator';
import { removeUndefinedAndAssign } from 'src/utils/object';
import { UsuarioService } from '../usuario/usuario.service';
import { RestauranteService } from '../restaurante/restaurante.service';
import { CupomWithRelations } from './cupom.entity';

@Injectable()
export class CupomService {
  constructor(
        private readonly repository: CupomRepository,
        private readonly usarioService: UsuarioService,
        private readonly restauranteService: RestauranteService,
  ) {}

  @Transaction()
  async create(data: CreateCupomDTO): Promise<CupomWithRelations> {

    const createData = CupomMapper.fromCreateDTOToEntity(data);

    if (!data.desconto || !data.restauranteId || !data.usuarioId) {
        throw new AppException(
          `Todos os campos obrigatórios devem ser fornecidos`,
          ExceptionType.INVALID_PARAMS,
        );
    }

    const usuario = await this.usarioService.getById(createData.usuario_id);
    await this.restauranteService.getById(createData.restaurante_id);

    const result = await this.repository.insert(createData);

    return {
      ...createData,
      id: result.insertId,
      usuario,
    };
  }

  async list() {
    const cupons = await this.repository.findAll();

    return cupons;
  }

  async getById(id: number) {
    const cupom = await this.repository.getById(id);

    if (!cupom) {
      throw new AppException(
        `Cupom com id ${id} não encontrado`,
        ExceptionType.DATA_NOT_FOUND,
      );
    }

    return cupom;
  }

  @Transaction()
  async updateById(
    id: number,
    data: UpdateCupomDTO,
  ): Promise<CupomWithRelations> {
    const cupom = await this.getById(id);
    const updateData = CupomMapper.fromUpdateDTOToEntity(data);
    let usuario = cupom.usuario;

    if(updateData.usuario_id) usuario = await this.usarioService.getById(updateData.usuario_id);
    if(updateData.restaurante_id) await this.restauranteService.getById(updateData.restaurante_id);

    await this.repository.updateById(cupom.id, updateData);

    removeUndefinedAndAssign(cupom, updateData);

    return {
      ...cupom,
      usuario
    };
  }

  @Transaction()
  async deleteById(id: number) {
    await this.repository.deleteById(id);
  }

}
