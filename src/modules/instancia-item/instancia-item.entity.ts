import { ItemWithRelations } from '../item/item.entity';

export interface InstanciaItem {
  id: number;
  preco: number;
  ativa: boolean;
  item_id: number;
}

export interface InstanciaItemWithRelations extends InstanciaItem {
  item: Omit<ItemWithRelations, 'instancia_ativa'>;
}
