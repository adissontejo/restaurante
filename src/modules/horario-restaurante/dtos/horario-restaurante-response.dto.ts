import { DiaSemana } from '../horario-restaurante.entity';

export interface HorarioRestauranteResponseDTO {
  abertura: string;
  fechamento: string;
  diaSemana: DiaSemana;
}
