import { Usuario } from "../usuario/usuario.entity";

export interface Cupom {
  id: number;
  desconto: number;
  usuario_id: number;
  restaurante_id: number;
}

export interface CupomWithRelations extends Cupom {
    usuario: Usuario;
}
