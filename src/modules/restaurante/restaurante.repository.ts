import { Injectable } from '@nestjs/common';
import {
  generateInsertBody,
  generateUpdateSetters,
  inject,
} from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { groupArray } from 'src/utils/array';
import { Cep } from '../cep/cep.entity';
import { HorarioRestaurante } from '../horario-restaurante/horario-restaurante.entity';
import { Restaurante, RestauranteWithRelations } from './restaurante.entity';

@Injectable()
export class RestauranteRepository {
  constructor(private readonly db: Database) {}

  async insert(restaurante: Omit<Restaurante, 'id'>) {
    const result = await this.db.query(`
      INSERT INTO restaurante ${generateInsertBody(restaurante)}
    `);

    return result;
  }

  async updateById(id: number, restaurante: Omit<Partial<Restaurante>, 'id'>) {
    const result = await this.db.query(`
      UPDATE restaurante
      SET
      ${generateUpdateSetters(restaurante)}
      WHERE id = ${inject(id)}
    `);

    return result;
  }

  async deleteById(id: number) {
    const result = await this.db.query(`
      DELETE
      FROM restaurante
      WHERE id = ${inject(id)}
    `);

    return result;
  }

  private async baseSelect(sql: string = '') {
    const rows = await this.db.query<
      { r: Restaurante; c: Cep; hr: HorarioRestaurante }[]
    >(`
      SELECT *
      FROM restaurante r
      JOIN cep c
      ON r.cep = c.cep
      LEFT JOIN horario_restaurante hr
      ON r.id = hr.restaurante_id
      ${sql}
    `);

    return groupArray(rows, {
      by(item) {
        return item.r.id;
      },
      format(group) {
        const restaurante: RestauranteWithRelations = {
          ...group[0].r,
          endereco_cep: group[0].c,
          horarios:
            group[0].hr.abertura !== null ? group.map((item) => item.hr) : [],
        };

        return restaurante;
      },
    });
  }

  async findAll() {
    const restaurantes = await this.baseSelect();

    return restaurantes;
  }

  async getById(id: number) {
    const [restaurante] = await this.baseSelect(`WHERE r.id = ${inject(id)}`);

    if (!restaurante) {
      return null;
    }

    return restaurante;
  }

  async getByDominio(dominio: string) {
    const [restaurante] = await this.baseSelect(
      `WHERE r.dominio = ${inject(dominio)}`,
    );

    if (!restaurante) {
      return null;
    }

    return restaurante;
  }
}
