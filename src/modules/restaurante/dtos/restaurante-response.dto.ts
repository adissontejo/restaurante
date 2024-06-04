import { HorarioRestauranteResponseDTO } from 'src/modules/horario-restaurante/dtos/horario-restaurante-response.dto';

export interface RestauranteResponseDTO {
  id: number;
  nome: string;
  rua: string;
  numero: number;
  cep: string;
  complemento?: string;
  dominio: string;
  bairro: string;
  cidade: string;
  estado: string;
  qtPedidosFidelidade: number | null;
  valorFidelidade: number | null;
  horarios: HorarioRestauranteResponseDTO[];
}
