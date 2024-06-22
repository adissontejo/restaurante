import { Opcao } from '../opcao/opcao.entity';

export interface OpcaoSelecionada {
  resposta_campo_formulario_id: number;
  opcao_id: number;
}

export interface OpcaoSelecionadaWithRelations {
  opcao: Opcao;
}
