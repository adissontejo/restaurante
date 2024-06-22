import { ItemPedidoResponseDTO } from 'src/modules/item-pedido/dtos/item-pedido-response.dto';

export interface PedidoResponseDTO {
  id: number;
  dataHora: string;
  numeroMesa: number;
  observacao: string | null;
  itens: ItemPedidoResponseDTO[];
}
