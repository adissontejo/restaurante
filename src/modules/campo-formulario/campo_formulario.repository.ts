import { Injectable } from '@nestjs/common';
import {
  generateInsertBody,
  generateUpdateSetters,
  inject,
} from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { groupArray } from 'src/utils/array';
import { CampoFormulario } from './campo_formulario.entity';

@Injectable()
export class CampoFormularioRepository {
    constructor(private readonly db: Database) {}

    async insert(cf: Omit<CampoFormulario, 'id'>) {
        const result = await this.db.query(`
            INSERT INTO campo_formulario ${generateInsertBody(cf)}
            `);

        return result;
    }

    async updateById(id: number, cf: Omit<Partial<CampoFormulario>, 'id'>) {
        const result = await this.db.query(`
          UPDATE campo_formulario
          SET
          ${generateUpdateSetters(cf)}
          WHERE id = ${inject(id)}
        `);
    
        return result
    }

    async deleteById(id: number) {
        const result = await this.db.query(`
          DELETE
          FROM campo_formulario
          WHERE id = ${inject(id)}
        `);
    
        return result;
      }

    private async baseSelect(sql: string = '') {
        const base = await this.db.query < {i: CampoFormulario}[] >
        (`
          SELECT *
          FROM campo_formulario i
          ${sql}
        `);
  
        return base.map(cf => cf.i);
    }

    async findByItemId(item_id: number) {
        const cfs = await this.baseSelect(`
          WHERE i.cf_id = ${inject(item_id)}
        `);
  
        return cfs;
    }

    async getById(id: number) {
        const [cf] = await this.baseSelect(`WHERE i.id = ${inject(id)}`);
  
        if (!cf) {
          return null;
        }
  
        return cf;
    }
}
