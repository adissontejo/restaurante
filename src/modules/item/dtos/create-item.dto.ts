import { CreateCampoFormularioDTO } from 'src/modules/campo-formulario/dto/create-campo-formulario.dto';

export interface CreateItemDTO {
  nome: string;
  preco: number;
  habilitado?: boolean;
  categoriaId: number;
  campos?: CreateCampoFormularioDTO[];
  foto?: Express.Multer.File;
}
