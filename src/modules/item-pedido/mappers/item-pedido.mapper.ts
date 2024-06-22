import { InstanciaItemMapper } from 'src/modules/instancia-item/mappers/instancia-item.mapper';
import { CreateItemPedidoDTO } from '../dtos/create-item-pedido.dto';
import { ItemPedidoResponseDTO } from '../dtos/item-pedido-response.dto';
import { ItemPedido, ItemPedidoWithRelations } from '../item-pedido.entity';
import { RespostaCampoFormularioMapper } from 'src/modules/resposta-campo-formulario/mappers/resposta-campo-formulario.mapper';

export abstract class ItemPedidoMapper {
  static fromCreateDTOToEntity(
    data: CreateItemPedidoDTO,
  ): Omit<ItemPedido, 'id'> {
    return {
      pedido_id: data.pedidoId,
      quantidade: data.quantidade,
      observacao: data.observacao,
      instancia_item_id: data.instanciaItemId,
    };
  }

  static fromEntityToResponseDTO(
    data: ItemPedidoWithRelations,
  ): ItemPedidoResponseDTO {
    return {
      id: data.id,
      instanciaItem: InstanciaItemMapper.fromEntityToResponseWithItemDTO(
        data.instancia_item,
      ),
      observacao: data.observacao,
      quantidade: data.quantidade,
      respostas: data.respostas.map(
        RespostaCampoFormularioMapper.fromEntityToResponseDTO,
      ),
    };
  }
}
