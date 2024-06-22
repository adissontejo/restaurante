import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/decorators/transaction.decorator';
import { CategoriaRepository } from './categoria.repository';
import { CreateCategoriaDTO } from './dtos/create-categoria.dto';
import { CategoriaWithRelations } from './categoria.entity';
import { CategoriaMapper } from './mapper/categoria.mapper';
import { UpdateCategoriaDTO } from './dtos/update-categoria.dto';
import { removeUndefinedAndAssign } from 'src/utils/object';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { RestauranteService } from '../restaurante/restaurante.service';

@Injectable()
export class CategoriaService {
  constructor(
    private readonly repository: CategoriaRepository,
    private readonly restauranteService: RestauranteService,
  ) {}

  @Transaction()
  async create(data: CreateCategoriaDTO): Promise<CategoriaWithRelations> {
    await this.restauranteService.getById(data.restauranteId);

    const createData = CategoriaMapper.fromCreateDTOToEntity(data);

    const result = await this.repository.insert(createData);

    return {
      ...createData,
      id: result.insertId,
      itens: [],
    };
  }

  @Transaction()
  async updateById(id: number, data: UpdateCategoriaDTO) {
    const categoria = await this.getById(id);

    const updateData = CategoriaMapper.fromUpdateDTOToEntity(data);

    await this.repository.updateById(id, updateData);

    removeUndefinedAndAssign(categoria, updateData);

    return categoria;
  }

  async list(restauranteId: number) {
    return this.repository.findByRestaurateId(restauranteId);
  }

  async getById(id: number) {
    const categoria = await this.repository.getById(id);

    if (!categoria) {
      throw new AppException(
        `Categoria com o id ${id} não encontrada`,
        ExceptionType.DATA_NOT_FOUND,
      );
    }

    return categoria;
  }

  async deleteById(id: number) {
    await this.repository.deleteById(id);
  }
}
