import { CreateCategoriaDTO } from '../dtos/create-categoria.dto';
import { CategoriaResponseDTO } from '../dtos/categoria-response.dto';
import { UpdateCategoriaDTO } from '../dtos/update-categoria.dto';
import { Categoria, CategoriaWithRelations } from '../categoria.entity';
import { ItemMapper } from 'src/modules/item/mappers/item.mapper';

export abstract class CategoriaMapper {
  static fromCreateDTOToEntity(
    data: CreateCategoriaDTO,
  ): Omit<Categoria, 'id'> {
    return {
      nome: data.nome,
      restaurante_id: data.restauranteId,
    };
  }

  static fromUpdateDTOToEntity(
    data: UpdateCategoriaDTO,
  ): Omit<Partial<Categoria>, 'id'> {
    return {
      nome: data.nome,
    };
  }

  static fromEntityToResponseDTO(
    data: CategoriaWithRelations,
  ): CategoriaResponseDTO {
    return {
      id: data.id,
      nome: data.nome,
      itens: data.itens.map(ItemMapper.fromEntityToResponseDTO),
    };
  }
}
