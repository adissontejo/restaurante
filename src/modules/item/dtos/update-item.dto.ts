import { CreateItemDTO } from './create-item.dto';

export interface UpdateItemDTO
  extends Partial<Omit<CreateItemDTO, 'restauranteId' | 'categoriaId'>> {}
