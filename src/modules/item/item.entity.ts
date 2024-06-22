import { CampoFormularioWithRelations } from '../campo-formulario/campo-formulario.entity';
import { InstanciaItem } from '../instancia-item/instancia-item.entity';

export interface Item {
  id: number;
  nome: string;
  habilitado: boolean;
  categoria_id: number;
  foto_url?: string;
}

export interface ItemWithRelations extends Item {
  instancia_ativa: InstanciaItem;
  campos: CampoFormularioWithRelations[];
}
