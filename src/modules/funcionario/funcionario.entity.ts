import { Usuario } from "../usuario/usuario.entity";

export interface Funcionario {
  id: number;
  cargo: string;
  usuario_id: number;
  restaurante_id: number;
}

export interface FuncionarioWithRelations extends Funcionario {
    usuario: Usuario;
}
