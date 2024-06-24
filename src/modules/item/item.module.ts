import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ItemRepository } from './item.repository';
import { InstanciaItemModule } from '../instancia-item/instancia-item.module';
import { CampoFormularioModule } from '../campo-formulario/campo_formulario.module';
import { RestauranteModule } from '../restaurante/restaurante.module';

@Module({
  imports: [InstanciaItemModule, CampoFormularioModule, RestauranteModule],
  providers: [ItemService, ItemRepository],
  controllers: [ItemController],
})
export class ItemModule {}
