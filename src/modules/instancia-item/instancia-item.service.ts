import { Injectable } from '@nestjs/common';
import { InstanciaItemRepository } from './instancia-item.repository';
import { InstanciaItem } from './instancia-item.entity';
import { InstanciaItemMapper } from './mappers/instancia-item.mapper';
import { Transaction } from 'src/decorators/transaction.decorator';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { Item } from '../item/item.entity';

@Injectable()
export class InstanciaItemService {
  constructor(private readonly repository: InstanciaItemRepository) {}

  @Transaction()
  async createForItem(item: Item, preco: number): Promise<InstanciaItem> {
    const createData = InstanciaItemMapper.fromCreateDTOToEntity({
      preco,
      itemId: item.id,
    });

    await this.repository.setInvativaByItemId(item.id);

    const result = await this.repository.insert(createData);

    return {
      ...createData,
      id: result.insertId,
    };
  }

  async getById(id: number) {
    const instanciaItem = await this.repository.getById(id);

    if (!instanciaItem) {
      throw new AppException(
        `Instancia item com id ${id} não encontrada`,
        ExceptionType.DATA_NOT_FOUND,
      );
    }

    return instanciaItem;
  }
}
