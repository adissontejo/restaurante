import { Module } from '@nestjs/common';
import { HorarioRestauranteRepository } from './horario-restaurante.repository';
import { HorarioRestauranteService } from './horario-restaurante.service';

@Module({
  providers: [HorarioRestauranteRepository, HorarioRestauranteService],
  exports: [HorarioRestauranteService],
})
export class HorarioRestauranteModule {}
