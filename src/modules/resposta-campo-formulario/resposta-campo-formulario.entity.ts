import { CampoFormularioWithRelations } from '../campo-formulario/campo-formulario.entity';
import { OpcaoSelecionadaWithRelations } from '../opcao-selecionada/opcao-selecionada.entity';

export interface RespostaCampoFormulario {
  id: number;
  item_pedido_id: number;
  campo_formulario_id: number;
  resposta?: string;
}

export interface RespostaCampoFormularioWithRelations
  extends RespostaCampoFormulario {
  campo_formulario: Omit<CampoFormularioWithRelations, 'item'>;
  opcoes?: OpcaoSelecionadaWithRelations[];
}
