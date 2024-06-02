import { Module } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { RestauranteController } from './restaurante.controller';
import { RestauranteRepository } from './restaurante.repository';
import { CepModule } from '../cep/cep.module';

@Module({
  imports: [CepModule],
  providers: [RestauranteService, RestauranteRepository],
  controllers: [RestauranteController],
})
export class RestauranteModule {}
