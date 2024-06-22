import { OpcaoMapper } from 'src/modules/opcao/mappers/opcao.mapper';
import { OpcaoSelecionadaWithRelations } from '../opcao-selecionada.entity';
import { OpcaoSelecionadaResponseDTO } from './opcao-selecionada-response.dto';

export abstract class OpcaoSelecionadaMapper {
  static fromEntityToResponseDTO(
    entity: OpcaoSelecionadaWithRelations,
  ): OpcaoSelecionadaResponseDTO {
    return {
      opcao: OpcaoMapper.fromEntityToResponseDTO(entity.opcao),
    };
  }
}
