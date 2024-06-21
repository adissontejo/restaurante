import { Injectable } from '@nestjs/common';
import {
  generateInsertBody,
  generateUpdateSetters,
  inject,
} from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { InstanciaItem } from './instancia_item.entity';

@Injectable()
export class InstanciaItemRepository {
    constructor(private readonly db: Database) {}

    async insert(iitem: Omit<InstanciaItem, 'id'>) {
        const result = await this.db.query(`
            INSERT INTO instancia_itemtem ${generateInsertBody(iitem)}
            `);

        return result;
    }

    async updateById(id: number, iitem: Omit<Partial<InstanciaItem>, 'id'>) {
        const result = await this.db.query(`
          UPDATE instancia_item
          SET
          ${generateUpdateSetters(iitem)}
          WHERE id = ${inject(id)}
        `);
    
        return result
    }

    async deleteById(id: number) {
        const result = await this.db.query(`
          DELETE
          FROM instancia_item
          WHERE id = ${inject(id)}
        `);
    
        return result;
      }

    private async baseSelect(sql: string = '') {
        const base = await this.db.query < {i: InstanciaItem}[] >
        (`
          SELECT *
          FROM instancia_item i
          ${sql}
        `);
  
        return base.map(iitem => iitem.i);
    }

    async findByItemId(item_id: number) {
        const itens = await this.baseSelect(`
          WHERE i.item_id = ${inject(item_id)}
        `);
  
        return itens;
    }

    async getById(id: number) {
        const [iitem] = await this.baseSelect(`WHERE i.id = ${inject(id)}`);
  
        if (!iitem) {
          return null;
        }
  
        return iitem;
    }

}
