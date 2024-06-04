import { CreateHorarioRestaurateDTO } from '../dtos/create-horario-restaurante.dto';
import { HorarioRestauranteResponseDTO } from '../dtos/horario-restaurante-response.dto';
import { HorarioRestaurante } from '../horario-restaurante.entity';

export abstract class HorarioRestauranteMapper {
  static fromCreateDTOToEntity(
    data: CreateHorarioRestaurateDTO,
    restauranteId: number,
  ): HorarioRestaurante {
    return {
      abertura: data.abertura,
      fechamento: data.fechamento,
      dia_semana: data.diaSemana,
      restaurante_id: restauranteId,
    };
  }

  static fromEntityToResponseDTO(
    data: HorarioRestaurante,
  ): HorarioRestauranteResponseDTO {
    return {
      abertura: data.abertura,
      fechamento: data.fechamento,
      diaSemana: data.dia_semana,
    };
  }
}
