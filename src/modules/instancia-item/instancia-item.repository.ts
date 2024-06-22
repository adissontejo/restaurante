import { Injectable } from '@nestjs/common';
import { generateInsertBody, inject } from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import {
  InstanciaItem,
  InstanciaItemWithRelations,
} from './instancia-item.entity';
import { Item } from '../item/item.entity';
import { Categoria } from '../categoria/categoria.entity';
import { groupArray } from 'src/utils/array';
import {
  CampoFormulario,
  CampoFormularioWithRelations,
} from '../campo-formulario/campo-formulario.entity';
import { Opcao } from '../opcao/opcao.entity';

@Injectable()
export class InstanciaItemRepository {
  constructor(private readonly db: Database) {}

  async insert(instanciaItem: Omit<InstanciaItem, 'id'>) {
    const result = await this.db.query(`
      INSERT INTO instancia_item ${generateInsertBody(instanciaItem)}
    `);

    return result;
  }

  async setInvativaByItemId(itemId: number) {
    const result = await this.db.query(`
      UPDATE instancia_item
      SET ativa = false
      WHERE item_id = ${inject(itemId)}
    `);

    return result;
  }

  private async baseSelect(sql: string = '') {
    const base = await this.db.query<
      {
        ii: InstanciaItem;
        i: Item;
        c: Categoria;
        cf: CampoFormulario;
        o: Opcao;
      }[]
    >(`
      SELECT *
      FROM instancia_item ii
      JOIN item i
      ON ii.item_id = i.id
      JOIN categoria c
      ON i.categoria_id = c.id
      LEFT JOIN campo_formulario cf
      ON i.id = cf.item_id
      AND cf.deletado = FALSE
      LEFT JOIN opcao o
      ON cf.id = o.campo_formulario_id
      ${sql}
    `);

    return groupArray(base, {
      by(item) {
        return item.ii.id;
      },
      format(group): InstanciaItemWithRelations {
        return {
          ...group[0].ii,
          item: {
            ...group[0].i,
            categoria: group[0].c,
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
          },
        };
      },
    });
  }

  async findAtivaByItemId(item_id: number) {
    const [instanciaItem] = await this.baseSelect(`
      WHERE ii.item_id = ${inject(item_id)}
      AND ii.ativa = TRUE
    `);

    return instanciaItem;
  }

  async getById(id: number) {
    const [instanciaItem] = await this.baseSelect(`
      WHERE ii.id = ${id}
    `);

    if (!instanciaItem) {
      return null;
    }

    return instanciaItem;
  }
}
