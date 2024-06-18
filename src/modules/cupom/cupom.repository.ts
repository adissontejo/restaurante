import { Injectable } from '@nestjs/common';
import {
  generateInsertBody,
  generateUpdateSetters,
  inject,
} from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { Cupom, CupomWithRelations } from './cupom.entity';
import { Restaurante } from '../restaurante/restaurante.entity';
import { Usuario } from '../usuario/usuario.entity';
import { groupArray } from 'src/utils/array';
import { ExceptionType } from 'src/core/exception.core';
import { HorarioRestaurante } from '../horario-restaurante/horario-restaurante.entity';
import { Cep } from '../cep/cep.entity';

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
        const rows = await this.db.query<
          { c: Cupom; u: Usuario; }[]
        >(`
            SELECT *
            FROM cupom c
            JOIN usuario u
            ON c.usuario_id = u.id
          ${sql}
        `);

        return groupArray(rows, {
          by(item) {
            return item.c.id;
          },
          format(group) {
            const cupom: CupomWithRelations = {
                ...group[0].c,
                usuario: group[0].u
            };

            return cupom;
          },
        });
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

}
