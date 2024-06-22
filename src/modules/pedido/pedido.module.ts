import { Module } from '@nestjs/common';
import { PedidoRepository } from './pedido.repository';
import { PedidoService } from './pedido.service';
import { PedidoGateway } from './pedido.gateway';

@Module({
  providers: [PedidoRepository, PedidoService, PedidoGateway],
  exports: [PedidoService],
})
export class PedidoModule {}
