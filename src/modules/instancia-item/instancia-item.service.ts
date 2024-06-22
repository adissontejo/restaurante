import { Injectable } from '@nestjs/common';
import { InstanciaItemRepository } from './instancia-item.repository';
import { CreateInstanciaItemDTO } from './dtos/create-instancia-item.dto';
import { InstanciaItem } from './instancia-item.entity';
import { InstanciaItemMapper } from './mappers/instancia-item.mapper';
import { Transaction } from 'src/decorators/transaction.decorator';

@Injectable()
export class InstanciaItemService {
  constructor(private readonly repository: InstanciaItemRepository) {}

  @Transaction()
  async unsafeCreate(data: CreateInstanciaItemDTO): Promise<InstanciaItem> {
    const createData = InstanciaItemMapper.fromCreateDTOToEntity(data);

    await this.repository.setInvativaByItemId(data.itemId);

    const result = await this.repository.insert(createData);

    return {
      ...createData,
      id: result.insertId,
    };
  }
}
