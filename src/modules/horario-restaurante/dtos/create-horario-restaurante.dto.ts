import { DiaSemana } from '../horario-restaurante.entity';

export interface CreateHorarioRestaurateDTO {
  abertura: string;
  fechamento: string;
  diaSemana: DiaSemana;
}
