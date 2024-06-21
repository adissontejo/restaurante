import { Injectable } from '@nestjs/common';
import {
  generateInsertBody,
  generateUpdateSetters,
  inject,
} from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { RCampoFormulario } from './resposta-campo-formulario.entity';

@Injectable()
export class RCampoFormularioRepository {
    constructor(private readonly db: Database) {}

    async insert(item: Omit<RCampoFormulario, 'id'>) {
        const result = await this.db.query(`
            INSERT INTO resposta_campo_formulario ${generateInsertBody(item)}
            `);

        return result;
    }

    async updateById(id: number, rcf: Omit<Partial<RCampoFormulario>, 'id'>) {
        const result = await this.db.query(`
          UPDATE resposta_campo_formulario
          SET
          ${generateUpdateSetters(rcf)}
          WHERE id = ${inject(id)}
        `);
    
        return result
    }

    async deleteById(id: number) {
        const result = await this.db.query(`
          DELETE
          FROM resposta_campo_formulario
          WHERE id = ${inject(id)}
        `);
    
        return result;
      }

    private async baseSelect(sql: string = '') {
        const base = await this.db.query < {i: RCampoFormulario}[] >
        (`
          SELECT *
          FROM resposta_campo_formulario i
          ${sql}
        `);
  
        return base.map(rcf => rcf.i);
    }

    async findByCampoFormularioId(campo_formulario_id: number) {
        const itens = await this.baseSelect(`
          WHERE i.campo_formulario_id = ${inject(campo_formulario_id)}
        `);
  
        return itens;
    }

    async findByCampoItemPedidoId(item_pedido_id: number) {
        const itens = await this.baseSelect(`
          WHERE i.item_pedido_id = ${inject(item_pedido_id)}
        `);
  
        return itens;
    }

    async getById(id: number) {
        const [rcf] = await this.baseSelect(`WHERE i.id = ${inject(id)}`);
  
        if (!rcf) {
          return null;
        }
  
        return rcf;
    }
}
