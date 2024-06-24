import { OpcaoResponseDTO } from 'src/modules/opcao/dtos/opcao-response.dto';
import { TipoCampo } from '../campo-formulario.entity';

export interface CampoFormularioResponseDTO {
  id: number;
  nome: string;
  tipoCampo: TipoCampo;
  qtMinOpcoes?: number;
  qtMaxOpcoes?: number;
  opcoes?: OpcaoResponseDTO[];
  obrigatorio: boolean;
}

export interface CampoFormularioResponseWithoutOpcoesDTO
  extends Omit<CampoFormularioResponseDTO, 'opcoes'> {}
