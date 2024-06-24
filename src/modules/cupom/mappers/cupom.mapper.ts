import { CreateCupomDTO } from '../dtos/create-cupom.dto';
import { UpdateCupomDTO } from '../dtos/update-cupom.dto';
import { CupomResponseDTO } from '../dtos/cupom-response.dto';
import { Cupom } from '../cupom.entity';

export abstract class CupomMapper {
  static fromCreateDTOToEntity(data: CreateCupomDTO): Omit<Cupom, 'id'> {
    return {
      desconto: data.desconto,
      restaurante_id: data.restauranteId,
      usuario_id: data.usuarioId,
    } as any;
  }

  static fromUpdateDTOToEntity(
    data: UpdateCupomDTO,
  ): Omit<Partial<Cupom>, 'id'> {
    return {
      desconto: data.desconto,
      restaurante_id: data.restauranteId,
      usuario_id: data.usuarioId,
    };
  }

  static fromEntityToResponseDTO(data: Cupom): CupomResponseDTO {
    return {
      id: data.id,
      desconto: data.desconto,
      restauranteId: data.restaurante_id,
      usuarioId: data.usuario_id,
      qtPedidosFeitos: data.qt_pedidos_feitos,
      qtPedidosTotal: data.qt_pedidos_total,
    };
  }
}
