import { CampoFormularioMapper } from 'src/modules/campo-formulario/mapper/campo-formulario.mapper';
import { CreateItemDTO } from '../dtos/create-item.dto';
import { ItemResponseDTO } from '../dtos/item-response.dto';
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

  static fromEntityToResponseDTO(data: ItemWithRelations): ItemResponseDTO {
    return {
      id: data.id,
      nome: data.nome,
      habilitado: data.habilitado,
      campos: data.campos?.map(CampoFormularioMapper.fromEntityToResponseDTO),
      instanciaAtiva: InstanciaItemMapper.fromEntityToResponseDTO(
        data.instancia_ativa,
      ),
      fotoUrl: data.foto_url || null,
    };
  }
}
