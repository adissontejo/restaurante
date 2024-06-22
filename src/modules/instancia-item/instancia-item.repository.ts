import { Injectable } from '@nestjs/common';
import { generateInsertBody, inject } from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { InstanciaItem } from './instancia-item.entity';

@Injectable()
export class InstanciaItemRepository {
  constructor(private readonly db: Database) {}

  async insert(instanciaItem: Omit<InstanciaItem, 'id'>) {
    const result = await this.db.query(`
      INSERT INTO instancia_item ${generateInsertBody(instanciaItem)}
    `);

    return result;
  }

  async setInvativaByItemId(itemId: number) {
    const result = await this.db.query(`
      UPDATE instancia_item
      SET ativa = false
      WHERE item_id = ${inject(itemId)}
    `);

    return result;
  }

  private async baseSelect(sql: string = '') {
    const base = await this.db.query<{ ii: InstanciaItem }[]>(`
      SELECT *
      FROM instancia_item ii
      ${sql}
    `);

    return base.map((item) => item.ii);
  }

  async findAtivaByItemId(item_id: number) {
    const [instanciaItem] = await this.baseSelect(`
      WHERE ii.item_id = ${inject(item_id)}
      AND ii.ativa = TRUE
    `);

    return instanciaItem;
  }
}
