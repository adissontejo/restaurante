import { CreateOpSelecionadaDTO } from "../dto/create-opcao-selecionada.dto";
import { OpSelecionadaResponseDTO } from "../dto/opcao-selecionada-response.dto";
import { UpdateOpSelecionadaDTO } from "../dto/update-opcao-selecionada.dto";
import { OpSelecionada } from "../opcao-selecionada.entity";

export abstract class OpSelecionadaMapper {
    static fromCreateDTOToEntity(
        data: CreateOpSelecionadaDTO,
    ) : Omit<OpSelecionada, 'id'> {
        return {
            resposta_campo_formulario_id: data.resposta_campo_formulario_id,
            opcao_id: data.opcao_id,
        };
    }

    static fromUpdateDTOToEntity(
        data: UpdateOpSelecionadaDTO,
    ): Omit<Partial<OpSelecionada>, 'id'>{
        return {
            resposta_campo_formulario_id: data.resposta_campo_formulario_id,
            opcao_id: data.opcao_id,
        };
    }
    
    static fromEntityToResponseDTO(
        data: OpSelecionada,
      ): OpSelecionadaResponseDTO {
        return {
            id: data.id,
            resposta_campo_formulario_id: data.resposta_campo_formulario_id,
            opcao_id: data.opcao_id,
        };
    }
}

