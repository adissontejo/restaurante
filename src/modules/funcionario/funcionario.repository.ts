import { Injectable } from '@nestjs/common';
import {
  generateInsertBody,
  generateUpdateSetters,
  inject,
} from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { Funcionario, FuncionarioWithRelations } from './funcionario.entity';
import { Restaurante } from '../restaurante/restaurante.entity';
import { Usuario } from '../usuario/usuario.entity';
import { groupArray } from 'src/utils/array';

@Injectable()
export class FuncionarioRepository {
  constructor(private readonly db: Database) {}

  async insert(funcionario: Omit<Funcionario, 'id'>) {
    const result = await this.db.query(`
        INSERT INTO funcionario ${generateInsertBody(funcionario)}
      `);

    return result;
  }

  async updateById(id: number, funcionario: Omit<Partial<Funcionario>, 'id'>) {
    const result = await this.db.query(`
        UPDATE funcionario
        SET
        ${generateUpdateSetters(funcionario)}
        WHERE id = ${inject(id)}
      `);

    return result;
  }

  async deleteById(id: number) {
    const result = await this.db.query(`
        DELETE
        FROM funcionario
        WHERE id = ${inject(id)}
      `);

    return result;
  }

  private async baseSelect(sql: string = '') {
    const rows = await this.db.query<
      { f: Funcionario; u: Usuario; r: Restaurante }[]
    >(`
          SELECT *
          FROM funcionario f
          JOIN usuario u
          ON f.usuario_id = u.id
          ${sql}
        `);

    return groupArray(rows, {
      by(item) {
        return item.f.id;
      },
      format(group) {
        const funcionario: FuncionarioWithRelations = {
          ...group[0].f,
          usuario: group[0].u,
        };

        return funcionario;
      },
    });
  }

  async findByRestaurante(restauranteId: number, usuarioId?: number) {
    const funcionarios = await this.baseSelect(`
      WHERE f.restaurante_id = ${restauranteId}
      ${(usuarioId && `AND f.usuario_id = ${usuarioId}`) || ''}
    `);

    return funcionarios;
  }

  async getById(id: number) {
    const [funcionario] = await this.baseSelect(`WHERE f.id = ${inject(id)}`);

    if (!funcionario) {
      return null;
    }

    return funcionario;
  }

  async getByUsuarioRestaurante(usuarioId: number, restauranteId: number) {
    const [restaurante] = await this.baseSelect(
      `WHERE f.restaurante_id = ${inject(restauranteId)}
            AND f.usuario_id = ${inject(usuarioId)}`,
    );

    if (!restaurante) {
      return null;
    }

    return restaurante;
  }

  async getLessResponsible(
    restauranteId: number,
  ): Promise<FuncionarioWithRelations | null> {
    const [data] = await this.db.query<{ f: Funcionario; u: Usuario }[]>(`
      SELECT f.*, u.*
      FROM funcionario f
      JOIN usuario u
      ON f.usuario_id = u.id
      LEFT JOIN pedido p
      ON f.id = p.funcionario_responsavel_id
      AND p.restaurante_id = ${inject(restauranteId)}
      LEFT JOIN item_pedido ip
      ON p.id = ip.pedido_id
      AND ip.status = 'preparando'
      WHERE f.cargo = 'garcom'
      AND f.restaurante_id = ${inject(restauranteId)}
      GROUP BY f.id, u.id
      ORDER BY COUNT(DISTINCT p.id)
      LIMIT 1
    `);

    if (!data) {
      return null;
    }

    return {
      ...data.f,
      usuario: data.u,
    };
  }
}
