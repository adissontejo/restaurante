import { CreateCampoFormularioDTO } from '../dto/create-campo-formulario.dto';
import { CampoFormularioResponseDTO } from '../dto/campo-formluario-response.dto';
import {
  CampoFormulario,
  CampoFormularioWithRelations,
} from '../campo-formulario.entity';
import { OpcaoMapper } from 'src/modules/opcao/mappers/opcao.mapper';

export abstract class CampoFormularioMapper {
  static fromCreateDTOToEntity(
    data: CreateCampoFormularioDTO & { itemId: number },
  ): Omit<CampoFormulario, 'id'> {
    return {
      nome: data.nome,
      tipo_campo: data.tipoCampo,
      qt_min_opcoes: data.qtMinOpcoes,
      qt_max_opcoes: data.qtMaxOpcoes,
      item_id: data.itemId,
      deletado: false,
    };
  }

  static fromEntityToResponseDTO(
    data: CampoFormularioWithRelations,
  ): CampoFormularioResponseDTO {
    return {
      id: data.id,
      nome: data.nome,
      tipoCampo: data.tipo_campo,
      qtMinOpcoes: data.qt_min_opcoes,
      qtMaxOpcoes: data.qt_max_opcoes,
      opcoes: data.opcoes.map(OpcaoMapper.fromEntityToResponseDTO),
    };
  }
}
