import { Module } from "@nestjs/common";
import { InstanciaItemService } from "./instancia_item.service";
import { InstanciaItemRepository } from "./instancia_item.repository";

@Module({
    providers: [InstanciaItemRepository, InstanciaItemService],
    exports: [InstanciaItemService]
})
export class InstanciaItemModule {}
