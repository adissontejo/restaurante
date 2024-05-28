import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/database.service';
import { CreateRestauranteDTO } from './dtos/CreateRestauranteDTO';
import { ResultSetHeader } from 'mysql2';

export interface CepRow {
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
}

export interface RestauranteRow {
  id: string;
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
export class RestauranteService {
  constructor(private readonly db: Database) {}

  async create(data: CreateRestauranteDTO) {
    const transaction = await this.db.transaction();

    try {
      const existingDomain = await transaction.query<RestauranteRow[]>(
        `
        SELECT *
        FROM restaurante r
        WHERE dominio = :dominio
      `,
        data,
      );

      if (existingDomain.length) {
        throw new Error(`Restaurante com o domínio ${data.dominio} já existe!`);
      }

      const [cep] = await transaction.query<CepRow[]>(
        `
        SELECT *
        FROM cep c
        WHERE c.cep = :cep;
      `,
        data,
      );

      if (!cep) {
        await transaction.query<ResultSetHeader>(
          `
          INSERT INTO cep (cep, estado, cidade, bairro)
          VALUES (:cep, :cidade, :estado, :bairro)
        `,
          data,
        );
      }

      const result = await transaction.query<ResultSetHeader>(
        `
          INSERT INTO restaurante (nome, rua, numero, cep, complemento, dominio, logo_url, qt_pedidos_fidelidade, valor_fidelidade)
          VALUES (:nome, :rua, :numero, :cep, :complemento, :dominio, :logo_url, :qt_pedidos_fidelidade, :valor_fidelidade)
        `,
        data,
      );

      transaction.finish();

      return {
        ...data,
        id: result.insertId,
      };
    } catch (e) {
      transaction.query('ROLLBACK;');

      throw e;
    }
  }

  async list() {
    const restaurantes = await this.db.query<RestauranteRow & CepRow>(`
      SELECT *
      FROM restaurante r
      LEFT JOIN cep c ON r.cep = c.cep
    `);

    return restaurantes;
  }
}
