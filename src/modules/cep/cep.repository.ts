import { Injectable } from '@nestjs/common';
import { Cep } from './cep.entity';
import { CepMapper } from './cep.mapper';
import { Database } from 'src/database/database.service';
import { generateInsertBody } from 'src/utils/sql';

export interface CepRow {
  cep: string;
  cidade: string;
  estado: string;
  bairro: string;
}

@Injectable()
export class CepRepository {
  constructor(private readonly db: Database) {}

  get mapping() {
    return {
      cep: 'cep',
      cidade: 'cidade',
      bairro: 'bairro',
      estado: 'estado',
    };
  }

  async insert(cep: Cep) {
    const row = CepMapper.fromEntityToRow(cep);

    const result = await this.db.query(
      `
      INSERT INTO cep ${generateInsertBody(row)}
    `,
      row,
    );

    return result;
  }

  async getByCep(cepString: string) {
    const [data] = await this.db.query<{ c: CepRow }[]>(
      `
      SELECT *
      FROM cep c
      WHERE cep = :cep;
    `,
      { cep: cepString },
    );

    if (!data.c) {
      return null;
    }

    return CepMapper.fromRowToEntity(data.c);
  }
}
