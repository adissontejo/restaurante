import { Injectable } from '@nestjs/common';
import { generateMultiInsertBody } from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { Opcao } from './opcao.entity';

@Injectable()
export class OpcaoRepository {
  constructor(private readonly db: Database) {}

  async insertMany(opcoes: Omit<Opcao, 'id'>[]) {
    const result = await this.db.query(`
      INSERT INTO opcao ${generateMultiInsertBody(opcoes)}
    `);

    return result;
  }

  async getById(id: number) {
    const result = await this.db.query<{ o: Opcao }>(`
      SELECT *
      FROM opcao o
      WHERE id = ${id}
    `);

    return result.o;
  }
}
