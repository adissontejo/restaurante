import { CreateItemDTO } from "../dtos/create-item.dto";
import { ItemResponseDTO } from "../dtos/item-response.dto";
import { UpdateItemDTO } from "../dtos/update-item.dto";
import { Item } from "../item.entity";

export abstract class ItemMapper {
    static fromCreateDTOToEntity(
        data: CreateItemDTO,
    ) : Omit<Item, 'id'> {
        return {
            nome: data.nome,
            habilitado: data.habilitado,
            restaurante_id: data.restaurante_id,
            foto_item_url: data.foto_item_url,
        };
    }

    static fromUpdateDTOToEntity(
        data: UpdateItemDTO,
    ): Omit<Partial<Item>, 'id'>{
        return {
            nome: data.nome,
            habilitado: data.habilitado,
            restaurante_id: data.restaurante_id,
            foto_item_url: data.foto_item_url,
        };
    }
    
    static fromEntityToResponseDTO(
        data: Item,
      ): ItemResponseDTO {
        return {
            id: data.id,
            nome: data.nome,
            habilitado: data.habilitado,
            restaurante_id: data.restaurante_id,
            foto_item_url: data.foto_item_url,
        };
    }
}

