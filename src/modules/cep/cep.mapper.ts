import { Cep } from './cep.entity';
import { CepRow } from './cep.repository';

export class CepMapper {
  static fromRowToEntity(cep: CepRow): Cep {
    return {
      cep: cep.cep,
      cidade: cep.cidade,
      estado: cep.estado,
      bairro: cep.bairro,
    };
  }

  static fromEntityToRow(cep: Cep): CepRow {
    return {
      cep: cep.cep,
      cidade: cep.cidade,
      estado: cep.estado,
      bairro: cep.bairro,
    };
  }
}
