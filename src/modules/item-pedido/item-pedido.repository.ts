import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/database.service';
import { ItemPedido, StatusItemPedido } from './item-pedido.entity';
import { generateMultiInsertBody, inject } from 'src/utils/sql';

@Injectable()
export class ItemPedidoRepository {
  constructor(private readonly db: Database) {}

  async insertMany(entities: Omit<ItemPedido, 'id'>[]) {
    const result = await this.db.query(`
      INSERT INTO item_pedido ${generateMultiInsertBody(entities)}
    `);

    return result;
  }

  async updateStatusById(id: number, status: StatusItemPedido) {
    const result = await this.db.query(`
      UPDATE item_pedido
      SET status = ${inject(status)}
      WHERE id = ${inject(id)}
    `);

    return result;
  }
}
