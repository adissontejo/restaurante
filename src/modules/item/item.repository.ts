import { Injectable } from '@nestjs/common';
import {
  generateInsertBody,
  generateUpdateSetters,
  inject,
} from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { groupArray } from 'src/utils/array';
import { Item } from './item.entity';

@Injectable()
export class ItemRepository {
    constructor(private readonly db: Database) {}

    async insert(item: Omit<Item, 'id'>) {
        const result = await this.db.query(`
            INSERT INTO item ${generateInsertBody(item)}
            `);

        return result;
    }

    async updateById(id: number, item: Omit<Partial<Item>, 'id'>) {
        const result = await this.db.query(`
          UPDATE item
          SET
          ${generateUpdateSetters(item)}
          WHERE id = ${inject(id)}
        `);
    
        return result
    }

    async deleteById(id: number) {
        const result = await this.db.query(`
          DELETE
          FROM item
          WHERE id = ${inject(id)}
        `);
    
        return result;
      }

    private async baseSelect(sql: string = '') {
        const base = await this.db.query < {i: Item}[] >
        (`
          SELECT *
          FROM item i
          ${sql}
        `);
  
        return base.map(item => item.i);
    }

    async findAll() {
        const itens = await this.baseSelect();
  
        return itens;
    }

    async getById(id: number) {
        const [item] = await this.baseSelect(`WHERE i.id = ${inject(id)}`);
  
        if (!item) {
          return null;
        }
  
        return item;
    }

    async getByEmail(email: string) {
        const [item] = await this.baseSelect(
          `WHERE i.email = ${inject(email)}`,
        );

        if (!item) {
          return null;
        }

        return item;
    }
}
