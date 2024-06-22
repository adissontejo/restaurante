import { CreatePedidoDTO } from '../dtos/create-pedido.dto';
import { Pedido } from '../pedido.entity';

export abstract class PedidoMapper {
  static fromCreateDTOToEntity(
    dto: CreatePedidoDTO & { funcionarioResponsavelId: number },
  ): Omit<Pedido, 'id'> {
    return {
      restaurante_id: dto.restauranteId,
      usuario_id: dto.usuarioId,
      funcionario_responsavel_id: dto.funcionarioResponsavelId,
      data_hora: new Date(),
      numero_mesa: dto.numeroMesa,
      observacao: dto.observacao,
    };
  }
}
