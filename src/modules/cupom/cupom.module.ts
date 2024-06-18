import { Module } from '@nestjs/common';
import { CupomRepository } from './cupom.repository';
import { CupomService } from './cupom.service';
import { CupomController } from './cupom.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { RestauranteModule } from '../restaurante/restaurante.module';

@Module({
  imports: [UsuarioModule, RestauranteModule],
  providers: [CupomRepository, CupomService],
  exports: [CupomService],
  controllers: [CupomController],
})
export class CupomModule {}
