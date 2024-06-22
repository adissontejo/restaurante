import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/database.service';
import { Pedido } from './pedido.entity';
import {
  generateInsertBody,
  generateUpdateSetters,
  inject,
} from 'src/utils/sql';

@Injectable()
export class PedidoRepository {
  constructor(private readonly db: Database) {}

  async insert(pedido: Omit<Pedido, 'id'>) {
    const result = await this.db.query(`
      INSERT INTO pedido ${generateInsertBody(pedido)}
    `);

    return result;
  }

  async updateById(id: number, pedido: Omit<Partial<Pedido>, 'id'>) {
    const result = await this.db.query(`
      UPDATE pedido
      SET ${generateUpdateSetters(pedido)}
      WHERE id = ${inject(id)}
    `);

    return result;
  }

  async deleteById(id: number) {
    const result = await this.db.query(`
      DELETE FROM pedido
      WHERE id = ${inject(id)}
    `);

    return result;
  }
}
