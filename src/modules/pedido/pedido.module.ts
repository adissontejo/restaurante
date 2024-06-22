import { Module } from '@nestjs/common';
import { PedidoRepository } from './pedido.repository';
import { PedidoService } from './pedido.service';
import { PedidoGateway } from './pedido.gateway';
import { RestauranteModule } from '../restaurante/restaurante.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { FuncionarioModule } from '../funcionario/funcionario.module';
import { ItemPedidoModule } from '../item-pedido/item-pedido.module';

@Module({
  imports: [
    RestauranteModule,
    UsuarioModule,
    FuncionarioModule,
    ItemPedidoModule,
  ],
  providers: [PedidoRepository, PedidoService, PedidoGateway],
  exports: [PedidoService],
})
export class PedidoModule {}
