import { Usuario } from '../usuario/usuario.entity';

export enum Cargo {
  DONO = 'dono',
  ADMIN = 'admin',
  COZINHEIRO = 'cozinheiro',
  GARCOM = 'garcom',
}

export interface Funcionario {
  id: number;
  cargo: Cargo;
  usuario_id: number;
  restaurante_id: number;
}

export interface FuncionarioWithRelations extends Funcionario {
  usuario: Usuario;
}
