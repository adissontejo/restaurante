import { CreateCategoriaDTO } from "../dtos/create-categoria.dto";
import { CategoriaResponseDTO } from "../dtos/categoria-response.dto";
import { UpdateCategoriaDTO } from "../dtos/update-categoria.dto";
import { Categoria } from "../categoria.entity";

export abstract class CategoriaMapper {
    static fromCreateDTOToEntity(
        data: CreateCategoriaDTO,
    ) : Omit<Categoria, 'id'> {
        return {
            nome: data.nome
        };
    }

    static fromUpdateDTOToEntity(
        data: UpdateCategoriaDTO,
    ): Omit<Partial<Categoria>, 'id'>{
        return {
            nome: data.nome,
        };
    }

    static fromEntityToResponseDTO(
        data: Categoria,
      ): CategoriaResponseDTO {
        return {
            id: data.id,
            nome: data.nome
        };
    }
}

