import { Module } from '@nestjs/common';
import { OpcaoSelecionadaRepository } from './opcao-selecionada.repository';
import { OpcaoSelecionadaService } from './opcao-selecionada.service';

@Module({
  providers: [OpcaoSelecionadaRepository, OpcaoSelecionadaService],
  exports: [OpcaoSelecionadaService],
})
export class OpcaoSelecionadaModule {}
