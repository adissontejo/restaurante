import { CampoFormularioWithRelations } from '../campo-formulario/campo-formulario.entity';
import { CategoriaWithRelations } from '../categoria/categoria.entity';
import { InstanciaItemWithRelations } from '../instancia-item/instancia-item.entity';

export interface Item {
  id: number;
  nome: string;
  habilitado: boolean;
  categoria_id: number;
  foto_url?: string;
}

export interface ItemWithRelations extends Item {
  instancia_ativa: Omit<InstanciaItemWithRelations, 'item'>;
  campos: Omit<CampoFormularioWithRelations, 'item'>[];
  categoria: Omit<CategoriaWithRelations, 'itens'>;
}
