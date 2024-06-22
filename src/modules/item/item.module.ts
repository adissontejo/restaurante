import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ItemRepository } from './item.repository';
import { InstanciaItemModule } from '../instancia-item/instancia-item.module';
import { CategoriaModule } from '../categoria/categoria.module';
import { CampoFormularioModule } from '../campo-formulario/campo_formulario.module';

@Module({
  imports: [InstanciaItemModule, CategoriaModule, CampoFormularioModule],
  providers: [ItemService, ItemRepository],
  controllers: [ItemController],
})
export class ItemModule {}
