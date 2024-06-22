import { Module } from '@nestjs/common';

import { CampoFormularioService } from './campo-formulario.service';
import { CampoFormularioRepository } from './campo-formulario.repository';
import { OpcaoModule } from '../opcao/opcao.module';

@Module({
  imports: [OpcaoModule],
  providers: [CampoFormularioService, CampoFormularioRepository],
  exports: [CampoFormularioService],
})
export class CampoFormularioModule {}
