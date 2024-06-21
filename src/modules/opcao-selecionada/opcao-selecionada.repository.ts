import { Injectable } from '@nestjs/common';
import {
  generateInsertBody,
  generateUpdateSetters,
  inject,
} from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { groupArray } from 'src/utils/array';
import { OpSelecionada } from './opcao-selecionada.entity';

@Injectable()
export class OpSelecionadaRepository {
    constructor(private readonly db: Database) {}

    async insert(ops: Omit<OpSelecionada, 'id'>) {
        const result = await this.db.query(`
            INSERT INTO opcao_selecionada ${generateInsertBody(ops)}
            `);

        return result;
    }

    async updateById(id: number, ops: Omit<Partial<OpSelecionada>, 'id'>) {
        const result = await this.db.query(`
          UPDATE opcao_selecionada
          SET
          ${generateUpdateSetters(ops)}
          WHERE id = ${inject(id)}
        `);
    
        return result
    }

    async deleteById(id: number) {
        const result = await this.db.query(`
          DELETE
          FROM opcao_selecionada
          WHERE id = ${inject(id)}
        `);
    
        return result;
      }

    private async baseSelect(sql: string = '') {
        const base = await this.db.query < {i: OpSelecionada}[] >
        (`
          SELECT *
          FROM opcao_selecionada i
          ${sql}
        `);
  
        return base.map(ops => ops.i);
    }

    async findByRespostaCampoFormularioId(resposta_campo_formulario_id: number) {
        const ops = await this.baseSelect(`
          WHERE i.resposta_campo_formulario_id = ${inject(resposta_campo_formulario_id)}
        `);
  
        return ops;
    }

    async findByOpcaoId(opcao_id: number) {
        const ops = await this.baseSelect(`
          WHERE i.opcao_id = ${inject(opcao_id)}
        `);
  
        return ops;
    }

    async getById(id: number) {
        const [ops] = await this.baseSelect(`WHERE i.id = ${inject(id)}`);
  
        if (!ops) {
          return null;
        }
  
        return ops;
    }

}
