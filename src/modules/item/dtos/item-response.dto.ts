import { CampoFormularioResponseDTO } from 'src/modules/campo-formulario/dto/campo-formluario-response.dto';
import { InstanciaItemResponseDTO } from 'src/modules/instancia-item/dtos/instancia-item-response.dto';

export interface ItemResponseDTO {
  id: number;
  nome: string;
  habilitado: boolean;
  campos: CampoFormularioResponseDTO[];
  instanciaAtiva: InstanciaItemResponseDTO;
  fotoUrl: string | null;
}
