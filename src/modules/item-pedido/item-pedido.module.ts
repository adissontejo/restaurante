import { Module } from '@nestjs/common';
import { RespostaCampoFormularioModule } from '../resposta-campo-formulario/resposta-campo-formulario.module';
import { ItemPedidoRepository } from './item-pedido.repository';
import { ItemPedidoService } from './item-pedido.service';
import { InstanciaItemModule } from '../instancia-item/instancia-item.module';

@Module({
  imports: [RespostaCampoFormularioModule, InstanciaItemModule],
  providers: [ItemPedidoRepository, ItemPedidoService],
  exports: [ItemPedidoService],
})
export class ItemPedidoModule {}
