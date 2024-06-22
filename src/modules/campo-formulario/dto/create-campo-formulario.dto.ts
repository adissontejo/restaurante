import { TipoCampo } from '../campo-formulario.entity';

export interface CreateCampoFormularioDTO {
  nome: string;
  tipoCampo: TipoCampo;
  qtMinOpcoes?: number;
  qtMaxOpcoes?: number;
  opcoes: string[];
}
