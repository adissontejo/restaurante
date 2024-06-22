import { OpcaoResponseDTO } from '../dtos/opcao-response.dto';
import { Opcao } from '../opcao.entity';

export abstract class OpcaoMapper {
  static fromEntityToResponseDTO(data: Opcao): OpcaoResponseDTO {
    return {
      id: data.id,
      texto: data.texto,
    };
  }
}
