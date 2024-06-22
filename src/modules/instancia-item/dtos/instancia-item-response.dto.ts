import { ItemResponseDTO } from 'src/modules/item/dtos/item-response.dto';

export interface InstanciaItemResponseDTO {
  id: number;
  preco: number;
  ativa: boolean;
}

export interface InstanciaItemWithItemResponseDTO {
  id: number;
  preco: number;
  ativa: boolean;
  item: Omit<ItemResponseDTO, 'instanciaAtiva' | 'campos'>;
}
