import { CreateCupomDTO } from '../dtos/create-cupom.dto';
import { UpdateCupomDTO } from '../dtos/update-cupom.dto';
import { CupomResponseDTO } from '../dtos/cupom-response.dto';
import { Cupom, CupomWithRelations } from '../cupom.entity';
import { UsuarioMapper } from 'src/modules/usuario/mappers/usuario.mapper';

export abstract class CupomMapper {
  static fromCreateDTOToEntity(
    data: CreateCupomDTO,
  ): Omit<Cupom, 'id'> {
    return {
        desconto: data.desconto,
        restaurante_id: data.restauranteId,
        usuario_id: data.usuarioId
    };
  }

  static fromUpdateDTOToEntity(
    data: UpdateCupomDTO,
  ): Omit<Partial<Cupom>, 'id'> {
    return {
        desconto: data.desconto,
        restaurante_id: data.restauranteId,
        usuario_id: data.usuarioId
    };
  }

  static fromEntityToResponseDTO(
    data: CupomWithRelations,
  ): CupomResponseDTO {
    return {
        id: data.id,
        desconto: data.desconto,
        restauranteId: data.restaurante_id,
        usuarioId: data.usuario_id,
        usuario: UsuarioMapper.fromEntityToResponseDTO(data.usuario),
    };
  }
}
