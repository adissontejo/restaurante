import { Module } from '@nestjs/common';
import { OpcaoSelecionadaModule } from '../opcao-selecionada/opcao-selecionada.module';
import { RespostaCampoFormularioRepository } from './resposta-campo-formulario.repository';
import { RespostaCampoFormularioService } from './resposta-campo-formulario.service';

@Module({
  imports: [OpcaoSelecionadaModule],
  providers: [
    RespostaCampoFormularioRepository,
    RespostaCampoFormularioService,
  ],
  exports: [RespostaCampoFormularioService],
})
export class RespostaCampoFormularioModule {}
