import { Usuario } from "../usuario/usuario.entity";

export interface Conta {
  id: number;
  mes: number;
  valor_total: number;
  valor_pago: number;
  usuario_id: number;
  restaurante_id: number;
}

export interface ContaWithRelations extends Conta {
    usuario: Usuario;
}
