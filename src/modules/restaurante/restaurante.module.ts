import { Module } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { RestauranteController } from './restaurante.controller';
import { RestauranteRepository } from './restaurante.repository';
import { CepModule } from '../cep/cep.module';
import { HorarioRestauranteModule } from '../horario-restaurante/horario-restaurante.module';

@Module({
  imports: [CepModule, HorarioRestauranteModule],
  providers: [RestauranteService, RestauranteRepository],
  exports: [RestauranteService],
  controllers: [RestauranteController],
})
export class RestauranteModule {}
