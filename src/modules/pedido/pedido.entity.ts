export interface Pedido {
  id: number;
  restaurante_id: number;
  usuario_id: number;
  funcionario_responsavel_id: number;
  data_hora: Date;
  numero_mesa: number;
  observacao?: string;
  nota_avaliacao?: number;
  observacao_avaliacao?: string;
}

export interface PedidoWithRelations extends Pedido {}
