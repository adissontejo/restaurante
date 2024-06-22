import { Injectable } from '@nestjs/common';
import { generateMultiInsertBody } from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { OpcaoSelecionada } from './opcao-selecionada.entity';

@Injectable()
export class OpcaoSelecionadaRepository {
  constructor(private readonly db: Database) {}

  async insertMany(opcoes: Omit<OpcaoSelecionada, 'id'>[]) {
    const result = await this.db.query(`
      INSERT INTO opcao_selecionada ${generateMultiInsertBody(opcoes)}
    `);

    return result;
  }
}
