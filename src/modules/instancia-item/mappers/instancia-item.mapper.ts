import { ItemMapper } from 'src/modules/item/mappers/item.mapper';
import { CreateInstanciaItemDTO } from '../dtos/create-instancia-item.dto';
import {
  InstanciaItemResponseDTO,
  InstanciaItemWithItemResponseDTO,
} from '../dtos/instancia-item-response.dto';
import {
  InstanciaItem,
  InstanciaItemWithRelations,
} from '../instancia-item.entity';

export abstract class InstanciaItemMapper {
  static fromCreateDTOToEntity(
    data: CreateInstanciaItemDTO,
  ): Omit<InstanciaItem, 'id'> {
    return {
      preco: data.preco,
      ativa: true,
      item_id: data.itemId,
    };
  }

  static fromEntityToResponseDTO(
    data: InstanciaItem,
  ): InstanciaItemResponseDTO {
    return {
      id: data.id,
      preco: data.preco,
      ativa: data.ativa,
    };
  }

  static fromEntityToResponseWithItemDTO(
    data: InstanciaItemWithRelations,
  ): InstanciaItemWithItemResponseDTO {
    return {
      ...this.fromEntityToResponseDTO(data),
      item: ItemMapper.fromEntityToResponseWithoutInstanciaDTO(data.item),
    };
  }
}
