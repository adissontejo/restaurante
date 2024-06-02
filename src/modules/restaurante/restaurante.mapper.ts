import { CepMapper } from '../cep/cep.mapper';
import { CepRow } from '../cep/cep.repository';
import { RestauranteResponseDTO } from './dtos/restaurante-response.dto';
import { Restaurante } from './restaurante.entity';
import { RestauranteRow } from './restaurante.repository';

export class RestauranteMapper {
  static fromRowToEntity(
    restaurante: RestauranteRow,
    cep: CepRow,
  ): Restaurante {
    return {
      id: restaurante.id,
      nome: restaurante.nome,
      dominio: restaurante.dominio,
      numero: restaurante.numero,
      rua: restaurante.rua,
      complemento: restaurante.complemento,
      cep: CepMapper.fromRowToEntity(cep),
    };
  }

  static fromEntityToRow(
    restaurante: Partial<Restaurante>,
  ): Partial<RestauranteRow> {
    return {
      id: restaurante.id,
      nome: restaurante.nome,
      dominio: restaurante.dominio,
      numero: restaurante.numero,
      rua: restaurante.rua,
      complemento: restaurante.complemento,
      cep: restaurante.cep?.cep,
    };
  }

  static fromEntityToResponseDTO(
    restaurante: Restaurante,
  ): RestauranteResponseDTO {
    return {
      id: restaurante.id,
      nome: restaurante.nome,
      dominio: restaurante.dominio,
      rua: restaurante.rua,
      numero: restaurante.numero,
      complemento: restaurante.complemento,
      cep: restaurante.cep.cep,
      cidade: restaurante.cep.cidade,
      estado: restaurante.cep.estado,
      bairro: restaurante.cep.bairro,
    };
  }
}
