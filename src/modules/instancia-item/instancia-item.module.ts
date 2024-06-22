import { Module } from '@nestjs/common';
import { InstanciaItemService } from './instancia-item.service';
import { InstanciaItemRepository } from './instancia-item.repository';

@Module({
  providers: [InstanciaItemRepository, InstanciaItemService],
  exports: [InstanciaItemService],
})
export class InstanciaItemModule {}
