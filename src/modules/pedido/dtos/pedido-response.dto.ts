import { FuncionarioResponseDTO } from 'src/modules/funcionario/dtos/funcionario-response.dto';
import { ItemPedidoResponseDTO } from 'src/modules/item-pedido/dtos/item-pedido-response.dto';

export interface PedidoResponseDTO {
  id: number;
  dataHora: Date;
  numeroMesa: number;
  observacao: string | null;
  itens: ItemPedidoResponseDTO[];
  iniciado: boolean;
  funcionarioResponsavel: FuncionarioResponseDTO | null;
}
