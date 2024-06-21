import { Module } from "@nestjs/common";
import { InstanciaItemService } from "./instancia_item.service";
import { InstanciaItemRepository } from "./instancia_item.repository";

@Module({
    providers: [InstanciaItemRepository, InstanciaItemService],
    controllers: [InstanciaItemService]
})
export class InstanciaItemModule {}
