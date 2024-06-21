import { Injectable } from '@nestjs/common';
import {
  generateInsertBody,
  generateUpdateSetters,
  inject,
} from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { Opcao } from './opcao.entity';

@Injectable()
export class OpcaoRepository {
    constructor(private readonly db: Database) {}

    async insert(opcao: Omit<Opcao, 'id'>) {
        const result = await this.db.query(`
            INSERT INTO opcao ${generateInsertBody(opcao)}
            `);

        return result;
    }

    async updateById(id: number, opcao: Omit<Partial<Opcao>, 'id'>) {
        const result = await this.db.query(`
          UPDATE opcao
          SET
          ${generateUpdateSetters(opcao)}
          WHERE id = ${inject(id)}
        `);
    
        return result
    }

    async deleteById(id: number) {
        const result = await this.db.query(`
          DELETE
          FROM opcao
          WHERE id = ${inject(id)}
        `);
    
        return result;
      }

    private async baseSelect(sql: string = '') {
        const base = await this.db.query < {o: Opcao}[] >
        (`
          SELECT *
          FROM opcao i
          ${sql}
        `);
  
        return base.map(opcao => opcao.o);
    }

    async findByCampoFormularioId(campo_formulario_id: number) {
        const opcoes = await this.baseSelect(`
          WHERE i.campo_formulario_id = ${inject(campo_formulario_id)}
        `);
  
        return opcoes;
    }

    async getById(id: number) {
        const [opcao] = await this.baseSelect(`WHERE i.id = ${inject(id)}`);
  
        if (!opcao) {
          return null;
        }
  
        return opcao;
    }
}
