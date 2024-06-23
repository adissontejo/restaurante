import { Module, forwardRef } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { RestauranteController } from './restaurante.controller';
import { RestauranteRepository } from './restaurante.repository';
import { CepModule } from '../cep/cep.module';
import { HorarioRestauranteModule } from '../horario-restaurante/horario-restaurante.module';
import { FuncionarioModule } from '../funcionario/funcionario.module';

@Module({
  imports: [
    CepModule,
    HorarioRestauranteModule,
    forwardRef(() => FuncionarioModule),
  ],
  providers: [RestauranteService, RestauranteRepository],
  exports: [RestauranteService],
  controllers: [RestauranteController],
})
export class RestauranteModule {}
