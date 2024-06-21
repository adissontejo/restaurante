import { CreateRCampoFormularioDTO } from "../dto/create-resposta-campo-formulario.dto";
import { RCampoFormularioResponseDTO } from "../dto/resposta-campo-formulario-response.dto";
import { UpdateRCampoFormularioDTO } from "../dto/update-campo-formulario.dto";
import { RCampoFormulario } from "../resposta-campo-formulario.entity";

export abstract class RCampoFormularioMapper {
    static fromCreateDTOToEntity(
        data: CreateRCampoFormularioDTO,
    ) : Omit<RCampoFormulario, 'id'> {
        return {
            resposta: data.resposta,
            campo_formulario_id: data.campo_formulario_id,
            item_pedido_id: data.item_pedido_id,
        };
    }

    static fromUpdateDTOToEntity(
        data: UpdateRCampoFormularioDTO,
    ): Omit<Partial<RCampoFormulario>, 'id'>{
        return {
            resposta: data.resposta,
            campo_formulario_id: data.campo_formulario_id,
            item_pedido_id: data.item_pedido_id,
        };
    }
    
    static fromEntityToResponseDTO(
        data: RCampoFormulario,
      ): RCampoFormularioResponseDTO {
        return {
            id: data.id,
            resposta: data.resposta,
            campo_formulario_id: data.campo_formulario_id,
            item_pedido_id: data.item_pedido_id,
        };
    }
}

