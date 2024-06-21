import { CreateInstanciaItemDTO } from '../dto/create-instancia_item.dto';
import { InstanciaItemResponseDTO } from '../dto/instancia_item-response.dto';
import { InstanciaItem } from '../instancia_item.entity';
import { UpdateInstanciaItemDTO } from '../dto/update-instancia_item.dto';

export abstract class InstanciaItemMapper {
  static fromCreateDTOToEntity(
    data: CreateInstanciaItemDTO,
  ): Omit<InstanciaItem, 'id'> {
    return {
        preco: data.preco,
        ativa: data.ativa,
        item_id: data.item_id,
    };
  }

  static fromUpdateDTOToEntity(
      data: UpdateInstanciaItemDTO,
  ): Omit<Partial<InstanciaItem>, 'id'>{
      return {
        preco: data.preco,
        ativa: data.ativa,
        item_id: data.item_id,
      };
  }

  static fromEntityToResponseDTO(
    data: InstanciaItem,
  ): InstanciaItemResponseDTO {
    return {
        preco: data.preco,
        ativa: data.ativa,
        item_id: data.item_id,
    };
  }
}
