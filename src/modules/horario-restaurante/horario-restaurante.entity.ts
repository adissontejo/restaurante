export enum DiaSemana {
  DOM = 'dom',
  SEG = 'seg',
  TER = 'ter',
  QUA = 'qua',
  QUI = 'qui',
  SEX = 'sex',
  SAB = 'sab',
}

export interface HorarioRestaurante {
  dia_semana: DiaSemana;
  abertura: string;
  fechamento: string;
  restaurante_id: number;
}
