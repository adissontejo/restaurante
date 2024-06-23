import { InstanciaItemWithRelations } from '../instancia-item/instancia-item.entity';
import { RespostaCampoFormularioWithRelations } from '../resposta-campo-formulario/resposta-campo-formulario.entity';

export enum StatusItemPedido {
  PREPARANDO = 'preparando',
  FINALIZADO = 'finalizado',
  CANCELADO = 'cancelado',
}

export interface ItemPedido {
  id: number;
  quantidade: number;
  observacao: string;
  pedido_id: number;
  instancia_item_id: number;
  status: StatusItemPedido;
}

export interface ItemPedidoWithRelations extends ItemPedido {
  instancia_item: InstanciaItemWithRelations;
  respostas: RespostaCampoFormularioWithRelations[];
}
