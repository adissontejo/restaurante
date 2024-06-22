import { Cargo } from '../funcionario.entity';

export interface CreateFuncionarioDTO {
  cargo: Cargo;
  usuarioId: number;
  restauranteId: number;
}
