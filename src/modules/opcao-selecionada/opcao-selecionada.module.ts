import { Module } from "@nestjs/common";
import { OpSelecionadaRepository } from "./opcao-selecionada.repository";
import { OpSelecionadaService } from "./opcao-selecionada.service";

@Module({
    providers: [OpSelecionadaRepository, OpSelecionadaService],
    exports: [OpSelecionadaService]
})
export class OpSelecionadaModule {}
