import { CreateFuncionarioDTO } from '../dtos/create-funcionario.dto';
import { UpdateFuncionarioDTO } from '../dtos/update-funcionario.dto';
import { FuncionarioResponseDTO } from '../dtos/funcionario-response.dto';
import { Funcionario, FuncionarioWithRelations } from '../funcionario.entity';
import { UsuarioMapper } from 'src/modules/usuario/mappers/usuario.mapper';

export abstract class FuncionarioMapper {
  static fromCreateDTOToEntity(
    data: CreateFuncionarioDTO,
  ): Omit<Funcionario, 'id'> {
    return {
      cargo: data.cargo,
      usuario_id: data.usuarioId,
      restaurante_id: data.restauranteId,
    };
  }

  static fromUpdateDTOToEntity(
    data: UpdateFuncionarioDTO,
  ): Omit<Partial<Funcionario>, 'id'> {
    return {
        cargo: data.cargo,
        usuario_id: data.usuarioId,
        restaurante_id: data.restauranteId,
    };
  }

  static fromEntityToResponseDTO(
    data: FuncionarioWithRelations,
  ): FuncionarioResponseDTO {

    return {
        id: data.id,
        cargo: data.cargo,
        usuarioId: data.usuario_id,
        restauranteId: data.restaurante_id,
        usuario: UsuarioMapper.fromEntityToResponseDTO(data.usuario),
    };
  }
}
