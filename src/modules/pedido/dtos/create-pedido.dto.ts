import { CreateItemPedidoDTO } from 'src/modules/item-pedido/dtos/create-item-pedido.dto';

export interface CreatePedidoDTO {
  restauranteId: number;
  usuarioId?: number;
  funcionarioId: number;
  numeroMesa: number;
  observacao?: string;
  itens: Omit<CreateItemPedidoDTO, 'pedidoId'>[];
}
