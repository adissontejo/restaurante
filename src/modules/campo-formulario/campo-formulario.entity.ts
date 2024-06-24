import { Item } from '../item/item.entity';
import { Opcao } from '../opcao/opcao.entity';

export enum TipoCampo {
  INPUT = 'input',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
}

export interface CampoFormulario {
  id: number;
  nome: string;
  tipo_campo: TipoCampo;
  qt_min_opcoes?: number;
  qt_max_opcoes?: number;
  item_id: number;
  deletado: boolean;
  obrigatorio: boolean;
}

export interface CampoFormularioWithRelations extends CampoFormulario {
  item: Item;
  opcoes: Opcao[];
}
