import { CampoFormularioWithRelations } from '../campo-formulario/campo-formulario.entity';
import { FuncionarioWithRelations } from '../funcionario/funcionario.entity';
import { InstanciaItemWithRelations } from '../instancia-item/instancia-item.entity';
import { ItemPedidoWithRelations } from '../item-pedido/item-pedido.entity';
import { ItemWithRelations } from '../item/item.entity';
import { RespostaCampoFormularioWithRelations } from '../resposta-campo-formulario/resposta-campo-formulario.entity';

export interface Pedido {
  id: number;
  restaurante_id: number;
  usuario_id?: number;
  funcionario_responsavel_id?: number;
  data_hora: Date;
  numero_mesa: number;
  observacao?: string;
  nota_avaliacao?: number;
  observacao_avaliacao?: string;
  iniciado: boolean;
}

export interface PedidoWithRelations extends Pedido {
  itens: (Omit<ItemPedidoWithRelations, 'instancia_item' | 'respostas'> & {
    instancia_item: Omit<InstanciaItemWithRelations, 'item'> & {
      item: Omit<ItemWithRelations, 'instancia_ativa' | 'campos' | 'categoria'>;
    };
    respostas: (Omit<
      RespostaCampoFormularioWithRelations,
      'campo_formulario'
    > & {
      campo_formulario: Omit<CampoFormularioWithRelations, 'opcoes' | 'item'>;
    })[];
  })[];
  funcionario_responsavel?: FuncionarioWithRelations;
}
