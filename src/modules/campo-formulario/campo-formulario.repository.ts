import { Injectable } from '@nestjs/common';
import { generateMultiInsertBody } from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { CampoFormulario } from './campo-formulario.entity';

@Injectable()
export class CampoFormularioRepository {
  constructor(private readonly db: Database) {}

  async insertMany(camposFormulario: Omit<CampoFormulario, 'id'>[]) {
    const result = await this.db.query(`
      INSERT INTO campo_formulario ${generateMultiInsertBody(camposFormulario)}
    `);

    return result;
  }

  async setDeletadoForItemId(itemId: number) {
    const result = await this.db.query(`
      UPDATE campo_formulario
      SET deletado = TRUE
      WHERE item_id = ${itemId}
    `);

    return result;
  }
}
