import { Opcao } from '../opcao/opcao.entity';

export enum TipoCampo {
  INPUT = 'input',
  SELECT = 'select',
}

export interface CampoFormulario {
  id: number;
  nome: string;
  tipo_campo: TipoCampo;
  qt_min_opcoes?: number;
  qt_max_opcoes?: number;
  item_id: number;
  deletado: boolean;
}

export interface CampoFormularioWithRelations extends CampoFormulario {
  opcoes: Opcao[];
}
