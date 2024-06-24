import { Injectable } from '@nestjs/common';
import {
  generateInsertBody,
  generateUpdateSetters,
  inject,
} from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { Item, ItemWithRelations } from './item.entity';
import { InstanciaItem } from '../instancia-item/instancia-item.entity';
import {
  CampoFormulario,
  CampoFormularioWithRelations,
} from '../campo-formulario/campo-formulario.entity';
import { Opcao } from '../opcao/opcao.entity';
import { groupArray } from 'src/utils/array';

@Injectable()
export class ItemRepository {
  constructor(private readonly db: Database) {}

  async insert(item: Omit<Item, 'id'>) {
    const result = await this.db.query(`
      INSERT INTO item ${generateInsertBody(item)}
    `);

    return result;
  }

  async updateById(id: number, item: Omit<Partial<Item>, 'id'>) {
    const result = await this.db.query(`
      UPDATE item
      SET
        ${generateUpdateSetters(item)}
      WHERE id = ${inject(id)}
    `);

    return result;
  }

  async deleteById(id: number) {
    const result = await this.db.query(`
      DELETE
      FROM item
      WHERE id = ${inject(id)}
    `);

    return result;
  }

  private async baseSelect(sql: string = '') {
    const base = await this.db.query<
      {
        i: Item;
        ii: InstanciaItem;
        cf: CampoFormulario;
        o: Opcao;
      }[]
    >(`
      SELECT *
      FROM item i
      LEFT JOIN instancia_item ii
      ON i.id = ii.item_id AND ii.ativa = TRUE
      LEFT JOIN campo_formulario cf
      ON i.id = cf.item_id
      AND cf.deletado = FALSE
      LEFT JOIN opcao o
      ON cf.id = o.campo_formulario_id
      ${sql}
    `);

    return groupArray(base, {
      by(item) {
        return item.i.id;
      },
      format(group): ItemWithRelations {
        return {
          ...group[0].i,
          instancia_ativa: group[0].ii,
          campos: group[0].cf.id
            ? groupArray(group, {
                by(item) {
                  return item.cf.id;
                },
                format(group): Omit<CampoFormularioWithRelations, 'item'> {
                  return {
                    ...group[0].cf,
                    opcoes: group[0].o.id ? group.map((item) => item.o) : [],
                  };
                },
              })
            : [],
        };
      },
    });
  }

  async findByRestauranteId(restauranteId: number) {
    const itens = await this.baseSelect(`
      WHERE i.restaurante_id = ${inject(restauranteId)}
      ORDER BY i.id
    `);

    return itens;
  }

  async getById(id: number) {
    const [item] = await this.baseSelect(`WHERE i.id = ${inject(id)}`);

    if (!item) {
      return null;
    }

    return item;
  }
}
