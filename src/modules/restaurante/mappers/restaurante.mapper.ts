import { HorarioRestauranteMapper } from 'src/modules/horario-restaurante/mappers/horario-restaurante.mapper';
import { CreateRestauranteDTO } from '../dtos/create-restaurante.dto';
import { RestauranteResponseDTO } from '../dtos/restaurante-response.dto';
import { UpdateRestauranteDTO } from '../dtos/update-restaurate.dto';
import { Restaurante, RestauranteWithRelations } from '../restaurante.entity';

export abstract class RestauranteMapper {
  static fromCreateDTOToEntity(
    data: CreateRestauranteDTO,
  ): Omit<Restaurante, 'id'> {
    return {
      nome: data.nome,
      dominio: data.dominio,
      numero: data.numero,
      rua: data.rua,
      cep: data.cep,
      complemento: data.complemento,
      qt_pedidos_fidelidade: data.qtPedidosFidelidade,
      valor_fidelidade: data.valorFidelidade,
    };
  }

  static fromUpdateDTOToEntity(
    data: UpdateRestauranteDTO,
  ): Omit<Partial<Restaurante>, 'id'> {
    return {
      nome: data.nome,
      dominio: data.dominio,
      numero: data.numero,
      rua: data.rua,
      cep: data.cep,
      complemento: data.complemento,
      qt_pedidos_fidelidade: data.qtPedidosFidelidade,
      valor_fidelidade: data.valorFidelidade,
    };
  }

  static fromEntityToResponseDTO(
    data: RestauranteWithRelations,
  ): RestauranteResponseDTO {
    return {
      id: data.id,
      nome: data.nome,
      dominio: data.dominio,
      rua: data.rua,
      numero: data.numero,
      complemento: data.complemento || null,
      cep: data.cep.cep,
      bairro: data.cep.bairro,
      cidade: data.cep.cidade,
      estado: data.cep.estado,
      qtPedidosFidelidade: data.qt_pedidos_fidelidade || null,
      valorFidelidade: data.valor_fidelidade || null,
      horarios: data.horarios.map(
        HorarioRestauranteMapper.fromEntityToResponseDTO,
      ),
    };
  }
}
