import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/database.service';
import { RespostaCampoFormulario } from './resposta-campo-formulario.entity';
import { generateMultiInsertBody } from 'src/utils/sql';

@Injectable()
export class RespostaCampoFormularioRepository {
  constructor(private readonly db: Database) {}

  async insertMany(respostas: Omit<RespostaCampoFormulario, 'id'>[]) {
    const result = await this.db.query(`
      INSERT INTO resposta_campo_formulario ${generateMultiInsertBody(respostas)}
    `);

    return result;
  }
}
