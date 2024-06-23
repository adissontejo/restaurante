import { CreatePedidoDTO } from '../dtos/create-pedido.dto';
import { PedidoResponseDTO } from '../dtos/pedido-response.dto';
import { Pedido, PedidoWithRelations } from '../pedido.entity';
import { ItemPedidoMapper } from 'src/modules/item-pedido/mappers/item-pedido.mapper';

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
      iniciado: false,
    };
  }

  static fromEntityToResponseDTO(
    entity: PedidoWithRelations,
  ): PedidoResponseDTO {
    return {
      id: entity.id,
      dataHora: entity.data_hora,
      numeroMesa: entity.numero_mesa,
      observacao: entity.observacao || null,
      itens: entity.itens.map(ItemPedidoMapper.fromEntityToResponseDTO),
      iniciado: entity.iniciado,
    };
  }
}
