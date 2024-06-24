import { CreateUsuarioDTO } from './create-usuario.dto';

export interface UpdateUsuarioDTO
  extends Partial<Omit<CreateUsuarioDTO, 'email'>> {}
