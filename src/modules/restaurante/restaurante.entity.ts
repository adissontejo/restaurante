import { Cep } from '../cep/cep.entity';

export class Restaurante {
  id: number;
  nome: string;
  rua: string;
  numero: number;
  complemento?: string;
  dominio: string;
  cep: Cep;
}
