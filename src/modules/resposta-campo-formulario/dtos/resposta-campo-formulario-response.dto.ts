import { CampoFormularioResponseDTO } from 'src/modules/campo-formulario/dto/campo-formluario-response.dto';
import { OpcaoSelecionadaResponseDTO } from 'src/modules/opcao-selecionada/mappers/opcao-selecionada-response.dto';

export interface RespostaCampoFormularioResponseDTO {
  id: number;
  campoFormulario: CampoFormularioResponseDTO;
  resposta: string | null;
  opcoes: OpcaoSelecionadaResponseDTO[] | null;
}
