import { Injectable } from '@nestjs/common';
import {
  generateInsertBody,
  generateUpdateSetters,
  inject,
} from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { Cupom } from './cupom.entity';

@Injectable()
export class CupomRepository {
  constructor(private readonly db: Database) {}

  async insert(cupom: Omit<Cupom, 'id'>) {
    const result = await this.db.query(`
        INSERT INTO cupom ${generateInsertBody(cupom)}
      `);

    return result;
  }

  async updateById(id: number, cupom: Omit<Partial<Cupom>, 'id'>) {
    const result = await this.db.query(`
        UPDATE cupom
        SET
        ${generateUpdateSetters(cupom)}
        WHERE id = ${inject(id)}
      `);

    return result;
  }

  async deleteById(id: number) {
    const result = await this.db.query(`
        DELETE
        FROM cupom
        WHERE id = ${inject(id)}
      `);

    return result;
  }

  private async baseSelect(sql: string = '') {
    const rows = await this.db.query<{ c: Cupom }[]>(`
            SELECT *
            FROM cupom c
          ${sql}
        `);

    return rows.map((item) => item.c);
  }

  async findAll() {
    const cupons = await this.baseSelect();

    return cupons;
  }

  async getById(id: number) {
    const [cupom] = await this.baseSelect(`WHERE c.id = ${inject(id)}`);

    if (!cupom) {
      return null;
    }

    return cupom;
  }

  async getUnusedByUsuarioAndRestaurante(
    usuarioId: number,
    restauranteId: number,
  ) {
    const cupons = await this.db.query<{ c: Cupom }[]>(`
      SELECT c.*
      FROM cupom c
      LEFT JOIN pedido p
      ON c.id = p.cupom_id
      WHERE p.id IS NULL
      AND c.usuario_id = ${inject(usuarioId)}
      AND c.restaurante_id = ${inject(restauranteId)}
    `);

    return cupons.map((item) => item.c);
  }

  async getIncompleteByUsuarioAndRestaurante(
    usuarioId: number,
    restauranteId: number,
  ) {
    const [cupom] = await this.db.query<{ c: Cupom }[]>(`
      SELECT c.*
      FROM cupom c
      LEFT JOIN pedido p
      ON c.id = p.cupom_id
      WHERE p.id IS NULL
      AND c.qt_pedidos_feitos < c.qt_pedidos_total
      AND c.usuario_id = ${inject(usuarioId)}
      AND c.restaurante_id = ${inject(restauranteId)}
    `);

    if (!cupom) {
      return null;
    }

    return cupom.c;
  }
}
