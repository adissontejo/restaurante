import { Module } from "@nestjs/common";
import { OpcaoService } from "./opcao.service";
import { OpcaoController } from "./opcao.controller";
import { OpcaoRepository } from "./opcao.repository";

@Module({
    providers: [OpcaoService, OpcaoRepository],
    controllers: [OpcaoController]
})
export class OpcaoModule {}
