import { CreateCategoriaDTO } from './create-categoria.dto';

export interface UpdateCategoriaDTO
  extends Partial<Omit<CreateCategoriaDTO, 'restauranteId'>> {}
