import { CreateInstanciaItemDTO } from '../dtos/create-instancia-item.dto';
import { InstanciaItemResponseDTO } from '../dtos/instancia-item-response.dto';
import { InstanciaItem } from '../instancia-item.entity';

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
}
