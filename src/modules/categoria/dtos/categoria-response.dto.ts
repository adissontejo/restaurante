import { ItemResponseDTO } from 'src/modules/item/dtos/item-response.dto';

export interface CategoriaResponseDTO {
  id: number;
  nome: string;
  itens: ItemResponseDTO[];
}
