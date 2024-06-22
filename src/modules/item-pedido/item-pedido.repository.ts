import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/database.service';
import { ItemPedido } from './item-pedido.entity';
import { generateMultiInsertBody } from 'src/utils/sql';

@Injectable()
export class ItemPedidoRepository {
  constructor(private readonly db: Database) {}

  async insertMany(entities: Omit<ItemPedido, 'id'>[]) {
    const result = await this.db.query(`
      INSERT INTO item_pedido ${generateMultiInsertBody(entities)}
    `);

    return result;
  }
}
