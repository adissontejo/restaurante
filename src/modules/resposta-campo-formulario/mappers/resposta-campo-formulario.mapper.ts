import { CampoFormularioMapper } from 'src/modules/campo-formulario/mapper/campo-formulario.mapper';
import { CreateRespostaCampoFormularioDTO } from '../dtos/create-resposta-campo-formulario.dto';
import { RespostaCampoFormularioResponseDTO } from '../dtos/resposta-campo-formulario-response.dto';
import {
  RespostaCampoFormulario,
  RespostaCampoFormularioWithRelations,
} from '../resposta-campo-formulario.entity';
import { OpcaoSelecionadaMapper } from 'src/modules/opcao-selecionada/mappers/opcao-selecionada.mapper';

export abstract class RespostaCampoFormularioMapper {
  static fromCreateDTOToEntity(
    data: CreateRespostaCampoFormularioDTO,
  ): Omit<RespostaCampoFormulario, 'id'> {
    return {
      campo_formulario_id: data.campoFormularioId,
      item_pedido_id: data.itemPedidoId,
      resposta: data.resposta,
    };
  }

  static fromEntityToResponseDTO(
    entity: RespostaCampoFormularioWithRelations,
  ): RespostaCampoFormularioResponseDTO {
    return {
      id: entity.id,
      campoFormulario:
        CampoFormularioMapper.fromEntityToResponseWithoutOpcoesDTO(
          entity.campo_formulario,
        ),
      resposta: entity.resposta || null,
      opcoes:
        entity.opcoes?.map(OpcaoSelecionadaMapper.fromEntityToResponseDTO) ||
        null,
    };
  }
}
