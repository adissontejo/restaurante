import { CreateOpcaoDTO } from "../dto/create-opcao.dto";
import { OpcaoResposeDTO } from "../dto/opcao-response.dto";
import { UpdateOpcaoDTO } from "../dto/update-opcao.dto";
import { Opcao } from "../opcao.entity";

export abstract class OpcaoMapper {
    static fromCreateDTOToEntity(
        data: CreateOpcaoDTO,
    ) : Omit<Opcao, 'id'> {
        return {
            texto: data.texto,
            campo_formulario_id: data.campo_formulario_id,
        };
    }

    static fromUpdateDTOToEntity(
        data: UpdateOpcaoDTO,
    ): Omit<Partial<Opcao>, 'id'>{
        return {
            texto: data.texto,
            campo_formulario_id: data.campo_formulario_id,
        };
    }
    
    static fromEntityToResponseDTO(
        data: Opcao,
      ): OpcaoResposeDTO {
        return {
            id: data.id,
            texto: data.texto,
            campo_formulario_id: data.campo_formulario_id,
        };
    }
}

