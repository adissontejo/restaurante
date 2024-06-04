import { Cep } from 'src/modules/cep/cep.entity';
import { HorarioRestaurante } from 'src/modules/horario-restaurante/horario-restaurante.entity';

export interface Restaurante {
  id: number;
  nome: string;
  rua: string;
  numero: number;
  cep: string;
  complemento?: string;
  dominio: string;
  logo_url?: string;
  qt_pedidos_fidelidade?: number;
  valor_fidelidade?: number;
}

export interface RestauranteWithRelations extends Omit<Restaurante, 'cep'> {
  cep: Cep;
  horarios: HorarioRestaurante[];
}
