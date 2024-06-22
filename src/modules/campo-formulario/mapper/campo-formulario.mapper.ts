import { CreateCampoFormularioDTO } from '../dto/create-campo-formulario.dto';
import {
  CampoFormularioResponseDTO,
  CampoFormularioResponseWithoutOpcoesDTO,
} from '../dto/campo-formluario-response.dto';
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

  static fromEntityToResponseWithoutOpcoesDTO(
    data: Omit<CampoFormularioWithRelations, 'item' | 'opcoes'>,
  ): CampoFormularioResponseWithoutOpcoesDTO {
    return {
      id: data.id,
      nome: data.nome,
      tipoCampo: data.tipo_campo,
      qtMinOpcoes: data.qt_min_opcoes,
      qtMaxOpcoes: data.qt_max_opcoes,
    };
  }

  static fromEntityToResponseDTO(
    data: Omit<CampoFormularioWithRelations, 'item'>,
  ): CampoFormularioResponseDTO {
    return {
      ...this.fromEntityToResponseWithoutOpcoesDTO(data),
      opcoes: data.opcoes.map(OpcaoMapper.fromEntityToResponseDTO),
    };
  }
}
