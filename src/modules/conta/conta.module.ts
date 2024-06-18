import { Module } from '@nestjs/common';
import { ContaRepository } from './conta.repository';
import { ContaService } from './conta.service';
import { ContaController } from './conta.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { RestauranteModule } from '../restaurante/restaurante.module';

@Module({
  imports: [UsuarioModule, RestauranteModule],
  providers: [ContaRepository, ContaService],
  exports: [ContaService],
  controllers: [ContaController],
})
export class ContaModule {}
