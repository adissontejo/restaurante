import { FuncionarioMapper } from 'src/modules/funcionario/mappers/funcionario.mapper';
import { CreatePedidoDTO } from '../dtos/create-pedido.dto';
import { PedidoResponseDTO } from '../dtos/pedido-response.dto';
import { Pedido, PedidoWithRelations } from '../pedido.entity';
import { ItemPedidoMapper } from 'src/modules/item-pedido/mappers/item-pedido.mapper';
import { CupomMapper } from 'src/modules/cupom/mappers/cupom.mapper';

export abstract class PedidoMapper {
  static fromCreateDTOToEntity(dto: CreatePedidoDTO): Omit<Pedido, 'id'> {
    return {
      restaurante_id: dto.restauranteId,
      usuario_id: dto.usuarioId,
      funcionario_responsavel_id: dto.funcionarioResponsavelId,
      data_hora: new Date(),
      numero_mesa: dto.numeroMesa,
      observacao: dto.observacao,
      iniciado: false,
      cupom_id: dto.cupomId,
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
      funcionarioResponsavel: entity.funcionario_responsavel
        ? FuncionarioMapper.fromEntityToResponseDTO(
            entity.funcionario_responsavel,
          )
        : null,
      cupom: entity.cupom
        ? CupomMapper.fromEntityToResponseDTO(entity.cupom)
        : null,
    };
  }
}
