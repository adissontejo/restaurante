import { CreateHorarioRestaurateDTO } from 'src/modules/horario-restaurante/dtos/create-horario-restaurante.dto';

export interface CreateRestauranteDTO {
  nome: string;
  rua: string;
  numero: number;
  cep: string;
  complemento?: string;
  dominio: string;
  horarios: CreateHorarioRestaurateDTO[];
  qtPedidosFidelidade?: number;
  valorFidelidade?: number;
  logo?: Express.Multer.File;
}
