import { Injectable } from '@nestjs/common';
import { HorarioRestauranteRepository } from './horario-restaurante.repository';
import { CreateHorarioRestaurateDTO } from './dtos/create-horario-restaurante.dto';
import { Transaction } from 'src/decorators/transaction.decorator';
import { compareTimes } from 'src/utils/time';
import { HorarioRestaurante } from './horario-restaurante.entity';
import { HorarioRestauranteMapper } from './mappers/horario-restaurante.mapper';
import { Restaurante } from '../restaurante/restaurante.entity';

@Injectable()
export class HorarioRestauranteService {
  constructor(private readonly repository: HorarioRestauranteRepository) {}

  @Transaction()
  async setHorariosForRestaurante(
    restaurante: Restaurante,
    data: CreateHorarioRestaurateDTO[],
  ) {
    await this.repository.deleteByRestaurante(restaurante.id);

    const horarios = data
      .map((item) =>
        HorarioRestauranteMapper.fromCreateDTOToEntity(item, restaurante.id),
      )
      .sort((a, b) => {
        if (a.dia_semana !== b.dia_semana) {
          return a.dia_semana < b.dia_semana ? -1 : 1;
        }

        return compareTimes(a.abertura, b.abertura);
      })
      .reduce<HorarioRestaurante[]>((acc, horario) => {
        const last = acc[acc.length - 1];

        if (
          last?.dia_semana !== horario.dia_semana ||
          compareTimes(last.fechamento, horario.abertura) < 0
        ) {
          acc.push(horario);
        } else if (compareTimes(last.fechamento, horario.fechamento) < 0) {
          last.fechamento = horario.fechamento;
        }

        return acc;
      }, []);

    await this.repository.insertMany(horarios);

    return horarios;
  }
}
