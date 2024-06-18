import { Module } from '@nestjs/common';
import { FuncionarioRepository } from './funcionario.repository';
import { FuncionarioService } from './funcionario.service';
import { FuncionarioController } from './funcionario.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { RestauranteModule } from '../restaurante/restaurante.module';

@Module({
  imports: [UsuarioModule, RestauranteModule],
  providers: [FuncionarioRepository, FuncionarioService],
  exports: [FuncionarioService],
  controllers: [FuncionarioController],
})
export class FuncionarioModule {}
