import { Injectable } from '@nestjs/common';
import {
  generateInsertBody,
  generateUpdateSetters,
  inject,
} from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { Conta, ContaWithRelations } from './conta.entity';
import { Restaurante } from '../restaurante/restaurante.entity';
import { Usuario } from '../usuario/usuario.entity';
import { groupArray } from 'src/utils/array';
import { ExceptionType } from 'src/core/exception.core';

@Injectable()
export class ContaRepository {
    constructor(private readonly db: Database) {}

    async insert(conta: Omit<Conta, 'id'>) {
      const result = await this.db.query(`
        INSERT INTO conta ${generateInsertBody(conta)}
      `);

      return result;
    }

    async updateById(id: number, conta: Omit<Partial<Conta>, 'id'>) {
      const result = await this.db.query(`
        UPDATE conta
        SET
        ${generateUpdateSetters(conta)}
        WHERE id = ${inject(id)}
      `);

      return result;
    }

    async deleteById(id: number) {
      const result = await this.db.query(`
        DELETE
        FROM conta
        WHERE id = ${inject(id)}
      `);

      return result;
    }

    private async baseSelect(sql: string = '') {
        const rows = await this.db.query<
          { c: Conta; u: Usuario; }[]
        >(`
          SELECT *
          FROM conta c
          JOIN usuario u
          ON c.usuario_id = u.id
          ${sql}
        `);

        return groupArray(rows, {
          by(item) {
            return item.c.id;
          },
          format(group) {
            const conta: ContaWithRelations = {
              ...group[0].c,
              usuario: group[0].u
            };

            return conta;
          },
        });
    }

    async findAll() {
      const contas = await this.baseSelect();

      return contas;
    }

    async getById(id: number) {
      const [conta] = await this.baseSelect(`WHERE c.id = ${inject(id)}`);

      if (!conta) {
        return null;
      }

      return conta;
    }

    async getByContaUsuarioMes(usuarioId: number, restauranteId: number, mes: number){

        const [restaurante] = await this.baseSelect(
            `WHERE c.restaurante_id = ${inject(restauranteId)}
            AND c.usuario_id = ${inject(usuarioId)}
            AND c.mes = ${inject(mes)}`,
        );

        if (!restaurante) {
            return null;
        }

        return restaurante;
    }
}
