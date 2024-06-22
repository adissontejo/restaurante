import { ItemWithRelations } from '../item/item.entity';

export interface Categoria {
  id: number;
  nome: string;
  restaurante_id: number;
}

export interface CategoriaWithRelations extends Categoria {
  itens: Omit<ItemWithRelations, 'campos'>[];
}
