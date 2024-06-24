import { CampoFormularioWithRelations } from '../campo-formulario/campo-formulario.entity';
import { InstanciaItemWithRelations } from '../instancia-item/instancia-item.entity';

export interface Item {
  id: number;
  nome: string;
  habilitado: boolean;
  categoria: string;
  foto_url?: string;
  restaurante_id: number;
}

export interface ItemWithRelations extends Item {
  instancia_ativa: Omit<InstanciaItemWithRelations, 'item'>;
  campos: Omit<CampoFormularioWithRelations, 'item'>[];
}
