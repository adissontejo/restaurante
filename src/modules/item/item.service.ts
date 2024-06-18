import { Injectable } from '@nestjs/common';
import { ItemRepository } from './item.repository';
import { StorageService } from 'src/storage/storage.service';
import { CreateItemDTO } from './dtos/create-item.dto';
import { Item } from './item.entity';
import { ItemMapper } from './mappers/item.mapper';
import { UpdateItemDTO } from './dtos/update-item.dto';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { Transaction } from 'src/decorators/transaction.decorator';
import { removeUndefinedAndAssign } from 'src/utils/object';

@Injectable()
export class ItemService {
    constructor(private readonly repository: ItemRepository) {}

    @Transaction()
    async create(data: CreateItemDTO): Promise<Item>{
        const createData = ItemMapper.fromCreateDTOToEntity(data)
    
        if (!data.nome || !data.habilitado || !data.restauranteId) {
            throw new AppException(
                `Todos os campos obrigatórios devem ser fornecidos`,
                ExceptionType.INVALID_PARAMS,
            )
        }

        const result = await this.repository.insert(createData);
        return {
        ...createData,
        id: result.insertId
        };
    }

    async list() {
        const itens = await this.repository.findAll();
    
        return itens;
    }

    async getById(id: number) {
        const item = await this.repository.getById(id);
    
        if (!item) {
          throw new AppException(
            `Item com id ${id} não encontrado`,
            ExceptionType.DATA_NOT_FOUND,
          );
        }
    
        return item;
    }

    @Transaction()
    async updateById(
        id: number,
        data: UpdateItemDTO
    ): Promise<Item> {
        const item = await this.getById(id);
        const updateData = ItemMapper.fromUpdateDTOToEntity(data);
    
        await this.repository.updateById(item.id, updateData);

        removeUndefinedAndAssign(item, updateData);

        return {
            ...item
          };
    }

    @Transaction()
    async deleteById(id: number) {
        const item = await this.getById(id);

        await this.repository.deleteById(id);
    }
    
}
