import { CreateCampoFormularioDTO } from "../dto/create-campo_formulario.dto";
import { CampoFormularioResponseDTO } from "../dto/campo_formluario-response.dto";
import { UpdateCampoFormularioDTO } from "../dto/update-campo_formulario.dto";
import { CampoFormulario } from "../campo_formulario.entity";

export abstract class CampoFormularioMapper {
    static fromCreateDTOToEntity(
        data: CreateCampoFormularioDTO,
    ) : Omit<CampoFormulario, 'id'> {
        return {
            nome: data.nome,
            tipo_campo: data.tipo_campo,
            qt_min_opcoes: data.qt_min_opcoes,
            qt_max_opcoes: data.qt_max_opcoes,
            item_id: data.item_id
        };
    }

    static fromUpdateDTOToEntity(
        data: UpdateCampoFormularioDTO,
    ): Omit<Partial<CampoFormulario>, 'id'>{
        return {
            nome: data.nome,
            tipo_campo: data.tipo_campo,
            qt_min_opcoes: data.qt_min_opcoes,
            qt_max_opcoes: data.qt_max_opcoes,
            item_id: data.item_id
        };
    }
    
    static fromEntityToResponseDTO(
        data: CampoFormulario,
      ): CampoFormularioResponseDTO {
        return {
            id: data.id,
            nome: data.nome,
            tipo_campo: data.tipo_campo,
            qt_min_opcoes: data.qt_min_opcoes,
            qt_max_opcoes: data.qt_max_opcoes,
            item_id: data.item_id
        };
    }
}

