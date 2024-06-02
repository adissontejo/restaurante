import { Injectable } from '@nestjs/common';
import { Restaurante } from './restaurante.entity';
import { CepRow } from '../cep/cep.repository';
import { RestauranteMapper } from './restaurante.mapper';
import { generateInsertBody, generateUpdateSetters } from 'src/utils/sql';
import { Database } from 'src/database/database.service';

export interface RestauranteRow {
  id: number;
  nome: string;
  rua: string;
  numero: number;
  cep: string;
  complemento?: string;
  dominio: string;
  logo_url?: string;
  qt_pedidos_fidelidade?: number;
  valor_fidelidade?: number;
}

@Injectable()
export class RestauranteRepository {
  constructor(private readonly db: Database) {}

  async insert(restaurante: Omit<Restaurante, 'id'>) {
    const row = RestauranteMapper.fromEntityToRow(restaurante);

    const result = await this.db.query(
      `
      INSERT INTO restaurante ${generateInsertBody(row)}
    `,
      row,
    );

    return result;
  }

  async updateById(id: number, restaurante: Omit<Partial<Restaurante>, 'id'>) {
    const row = RestauranteMapper.fromEntityToRow(restaurante);

    const result = await this.db.query(
      `
        UPDATE restaurante
        SET ${generateUpdateSetters(row)}
        WHERE id = :id
      `,
      { ...row, id },
    );

    return result;
  }

  async deleteById(id: number) {
    const result = await this.db.query(
      `
        DELETE
        FROM restaurante
        WHERE id = :id
      `,
      { id },
    );

    return result;
  }

  async getAll() {
    const rows = await this.db.query<{ r: RestauranteRow; c: CepRow }[]>(
      `
        SELECT *
        FROM restaurante r
        JOIN cep c
        ON r.cep = c.cep;
      `,
    );

    return rows.map((data) =>
      RestauranteMapper.fromRowToEntity(data.r, data.c),
    );
  }

  async getById(id: number) {
    const [row] = await this.db.query<{ r: RestauranteRow; c: CepRow }[]>(
      `
        SELECT *
        FROM restaurante r
        JOIN cep c
        ON r.cep = c.cep
        WHERE r.id = :id;
      `,
      { id },
    );

    if (!row) {
      return null;
    }

    return RestauranteMapper.fromRowToEntity(row.r, row.c);
  }

  async getByDominio(dominio: string) {
    const [data] = await this.db.query<{ r: RestauranteRow; c: CepRow }[]>(
      `
        SELECT *
        FROM restaurante r
        JOIN cep c
        ON r.cep = c.cep
        WHERE r.dominio = :dominio;
      `,
      { dominio },
    );

    if (!data) {
      return null;
    }

    return RestauranteMapper.fromRowToEntity(data.r, data.c);
  }
}
