import { Injectable } from '@nestjs/common';
import { InstanciaItemRepository } from './instancia_item.repository';
import { CreateInstanciaItemDTO } from './dto/create-instancia_item.dto';
import { InstanciaItem } from './instancia_item.entity';
import { InstanciaItemMapper } from './mapper/instancia_item.mapper';
import { UpdateInstanciaItemDTO } from './dto/update-instancia_item.dto';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { Transaction } from 'src/decorators/transaction.decorator';
import { removeUndefinedAndAssign } from 'src/utils/object';

@Injectable()
export class InstanciaItemService {
    constructor(
        private readonly repository: InstanciaItemRepository,
    ) {}

    @Transaction()
    async create(data: CreateInstanciaItemDTO): Promise<InstanciaItem> {
        const createData = InstanciaItemMapper.fromCreateDTOToEntity(data)

        console.log(createData)
        
        if (!data.preco || !data.ativa || !data.item_id) {
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

    async list(item_id: number) {
        const iitens = await this.repository.findByItemId(item_id);
    
        return iitens;
    }

    async getById(id: number) {
        const iitem = await this.repository.getById(id);
    
        if (!iitem) {
          throw new AppException(
            `Item com id ${id} não encontrado`,
            ExceptionType.DATA_NOT_FOUND,
          );
        }
    
        return iitem;
    }

    @Transaction()
    async updateById(
        id: number,
        data: UpdateInstanciaItemDTO
    ): Promise<InstanciaItem> {
        const iitem = await this.getById(id);
        const updateData = InstanciaItemMapper.fromUpdateDTOToEntity(data);
    
        await this.repository.updateById(iitem.id, updateData);

        removeUndefinedAndAssign(iitem, updateData);

        return {
            ...iitem
          };
    }

    @Transaction()
    async deleteById(id: number) {
        const item = await this.getById(id);

        await this.repository.deleteById(id);
    }
    
}
