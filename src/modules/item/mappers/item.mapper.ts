import { CampoFormularioMapper } from 'src/modules/campo-formulario/mapper/campo-formulario.mapper';
import { CreateItemDTO } from '../dtos/create-item.dto';
import {
  ItemResponseDTO,
  ItemResponseWithoutInstanciaDTO,
} from '../dtos/item-response.dto';
import { UpdateItemDTO } from '../dtos/update-item.dto';
import { Item, ItemWithRelations } from '../item.entity';
import { InstanciaItemMapper } from 'src/modules/instancia-item/mappers/instancia-item.mapper';

export abstract class ItemMapper {
  static fromCreateDTOToEntity(
    data: CreateItemDTO & { fotoUrl?: string },
  ): Omit<Item, 'id'> {
    return {
      nome: data.nome,
      habilitado: data.habilitado === undefined ? true : data.habilitado,
      categoria_id: data.categoriaId,
      foto_url: data.fotoUrl,
    };
  }

  static fromUpdateDTOToEntity(
    data: UpdateItemDTO & { fotoUrl?: string },
  ): Omit<Partial<Item>, 'id'> {
    return {
      nome: data.nome,
      habilitado: data.habilitado,
      foto_url: data.fotoUrl,
    };
  }

  static fromEntityToResponseWithoutInstanciaDTO(
    data: Omit<ItemWithRelations, 'instancia_ativa' | 'campos'>,
  ): ItemResponseWithoutInstanciaDTO {
    return {
      id: data.id,
      nome: data.nome,
      habilitado: data.habilitado,
      fotoUrl: data.foto_url || null,
    };
  }

  static fromEntityToResponseDTO(data: ItemWithRelations): ItemResponseDTO {
    return {
      ...ItemMapper.fromEntityToResponseWithoutInstanciaDTO(data),
      instanciaAtiva: InstanciaItemMapper.fromEntityToResponseDTO(
        data.instancia_ativa,
      ),
      campos: data.campos?.map(CampoFormularioMapper.fromEntityToResponseDTO),
    };
  }
}
