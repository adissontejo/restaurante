import { Module } from '@nestjs/common';
import { PedidoRepository } from './pedido.repository';
import { PedidoService } from './pedido.service';
import { PedidoGateway } from './pedido.gateway';
import { RestauranteModule } from '../restaurante/restaurante.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { FuncionarioModule } from '../funcionario/funcionario.module';
import { ItemPedidoModule } from '../item-pedido/item-pedido.module';
import { CupomModule } from '../cupom/cupom.module';

@Module({
  imports: [
    RestauranteModule,
    UsuarioModule,
    FuncionarioModule,
    ItemPedidoModule,
    CupomModule,
  ],
  providers: [PedidoRepository, PedidoService, PedidoGateway],
  exports: [PedidoService],
})
export class PedidoModule {}
