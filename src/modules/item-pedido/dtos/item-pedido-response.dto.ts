import { InstanciaItemWithItemResponseDTO } from 'src/modules/instancia-item/dtos/instancia-item-response.dto';
import { RespostaCampoFormularioResponseDTO } from 'src/modules/resposta-campo-formulario/dtos/resposta-campo-formulario-response.dto';
import { StatusItemPedido } from '../item-pedido.entity';

export interface ItemPedidoResponseDTO {
  id: number;
  instanciaItem: InstanciaItemWithItemResponseDTO;
  observacao: string | null;
  quantidade: number;
  respostas: RespostaCampoFormularioResponseDTO[];
  status: StatusItemPedido;
}
