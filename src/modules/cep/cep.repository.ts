import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/database.service';
import { generateInsertBody, inject } from 'src/utils/sql';
import { Cep } from './cep.entity';

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
    const result = await this.db.query(`
      INSERT INTO cep ${generateInsertBody(cep)}
    `);

    return result;
  }

  async getByCep(cep: string) {
    const [data] = await this.db.query<{ c: Cep }[]>(`
      SELECT *
      FROM cep c
      WHERE cep = ${inject(cep)};
    `);

    if (!data.c) {
      return null;
    }

    return data.c;
  }
}
