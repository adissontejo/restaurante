import { CreateCampoFormularioDTO } from 'src/modules/campo-formulario/dto/create-campo-formulario.dto';

export interface CreateItemDTO {
  nome: string;
  preco: number;
  habilitado?: boolean;
  categoria: string;
  campos?: CreateCampoFormularioDTO[];
  foto?: Express.Multer.File;
  restauranteId: number;
}
