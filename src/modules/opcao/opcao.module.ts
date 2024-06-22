import { Module } from '@nestjs/common';
import { OpcaoService } from './opcao.service';
import { OpcaoRepository } from './opcao.repository';

@Module({
  providers: [OpcaoService, OpcaoRepository],
  exports: [OpcaoService],
})
export class OpcaoModule {}
