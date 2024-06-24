import { Injectable } from '@nestjs/common';
import { ItemRepository } from './item.repository';
import { CreateItemDTO } from './dtos/create-item.dto';
import { ItemWithRelations } from './item.entity';
import { ItemMapper } from './mappers/item.mapper';
import { UpdateItemDTO } from './dtos/update-item.dto';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { Transaction } from 'src/decorators/transaction.decorator';
import { removeUndefinedAndAssign } from 'src/utils/object';
import { InstanciaItemService } from '../instancia-item/instancia-item.service';
import { CampoFormularioService } from '../campo-formulario/campo-formulario.service';
import { CampoFormularioWithRelations } from '../campo-formulario/campo-formulario.entity';
import { StorageService } from 'src/storage/storage.service';
import { RestauranteService } from '../restaurante/restaurante.service';

@Injectable()
export class ItemService {
  constructor(
    private readonly repository: ItemRepository,
    private readonly instanciaItemService: InstanciaItemService,
    private readonly campoFormularioService: CampoFormularioService,
    private readonly storageService: StorageService,
    private readonly restauranteService: RestauranteService,
  ) {}

  @Transaction()
  async create(data: CreateItemDTO): Promise<ItemWithRelations> {
    const createData = ItemMapper.fromCreateDTOToEntity(data);

    await this.restauranteService.getById(data.restauranteId);

    if (data.foto) {
      createData.foto_url = await this.storageService.uploadFile(data.foto);
    }

    const result = await this.repository.insert(createData);

    let campos: CampoFormularioWithRelations[] = [];

    if (data.campos) {
      campos = await this.campoFormularioService.setCamposFormularioForItem(
        { ...createData, id: result.insertId },
        data.campos,
      );
    }

    const instanciaItem = await this.instanciaItemService.createForItem(
      { ...createData, id: result.insertId },
      data.preco,
    );

    return {
      ...createData,
      id: result.insertId,
      instancia_ativa: instanciaItem,
      campos,
    };
  }

  async list(restauranteId: number) {
    const itens = await this.repository.findByRestauranteId(restauranteId);

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
    data: UpdateItemDTO,
  ): Promise<ItemWithRelations> {
    const item = await this.getById(id);

    const updateData = ItemMapper.fromUpdateDTOToEntity(data);

    if (data.foto) {
      if (item.foto_url) {
        await this.storageService.deleteFile(item.foto_url);
      }

      updateData.foto_url = await this.storageService.uploadFile(data.foto);
    }

    await this.repository.updateById(item.id, updateData);

    let instanciaItem = item.instancia_ativa;
    let campos = item.campos;

    if (data.preco && data.preco !== item.instancia_ativa.preco) {
      instanciaItem = await this.instanciaItemService.createForItem(
        item,
        data.preco,
      );
    }

    if (data.campos !== undefined) {
      campos = await this.campoFormularioService.setCamposFormularioForItem(
        item,
        data.campos || [],
      );
    }

    removeUndefinedAndAssign(item, updateData);

    return {
      ...item,
      instancia_ativa: instanciaItem,
      campos,
    };
  }

  @Transaction()
  async deleteById(id: number) {
    await this.repository.deleteById(id);
  }
}
