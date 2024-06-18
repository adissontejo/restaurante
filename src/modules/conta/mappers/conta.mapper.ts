import { CreateContaDTO } from '../dtos/create-conta.dto';
import { UpdateContaDTO } from '../dtos/update-conta.dto';
import { ContaResponseDTO } from '../dtos/conta-response.dto';
import { Conta, ContaWithRelations } from  '../conta.entity';
import { UsuarioMapper } from 'src/modules/usuario/mappers/usuario.mapper';

export abstract class ContaMapper {
  static fromCreateDTOToEntity(
    data: CreateContaDTO,
  ): Omit<Conta, 'id'> {
    return {
      mes: data.mes,
      valor_pago: data.valorPago,
      valor_total: data.valorTotal,
      usuario_id: data.usuarioId,
      restaurante_id: data.restauranteId,
    };
  }

  static fromUpdateDTOToEntity(
    data: UpdateContaDTO,
  ): Omit<Partial<Conta>, 'id'> {
    return {
        mes: data.mes,
        valor_pago: data.valorPago,
        valor_total: data.valorTotal,
        usuario_id: data.usuarioId,
        restaurante_id: data.restauranteId,
    };
  }

  static fromEntityToResponseDTO(
    data: ContaWithRelations,
  ): ContaResponseDTO {

    return {
        id: data.id,
        mes: data.mes,
        valorPago: data.valor_pago,
        valorTotal: data.valor_total,
        usuarioId: data.usuario_id,
        restauranteId: data.restaurante_id,
        usuario: UsuarioMapper.fromEntityToResponseDTO(data.usuario),
    };
  }
}
