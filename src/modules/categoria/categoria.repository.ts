import { Injectable } from '@nestjs/common';
import {
  generateInsertBody,
  generateUpdateSetters,
  inject,
} from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { Categoria, CategoriaWithRelations } from './categoria.entity';
import { groupArray } from 'src/utils/array';
import { Item } from '../item/item.entity';
import { InstanciaItem } from '../instancia-item/instancia-item.entity';
import { CampoFormulario } from '../campo-formulario/campo-formulario.entity';
import { Opcao } from '../opcao/opcao.entity';

@Injectable()
export class CategoriaRepository {
  constructor(private readonly db: Database) {}

  async insert(categoria: Omit<Categoria, 'id'>) {
    const result = await this.db.query(`
      INSERT INTO categoria ${generateInsertBody(categoria)}
    `);

    return result;
  }

  async updateById(id: number, categoria: Omit<Partial<Categoria>, 'id'>) {
    const result = await this.db.query(`
      UPDATE categoria
      SET
        ${generateUpdateSetters(categoria)}
      WHERE id = ${inject(id)}
    `);

    return result;
  }

  async deleteById(id: number) {
    const result = await this.db.query(`
      DELETE
      FROM categoria
      WHERE id = ${inject(id)}
    `);

    return result;
  }

  private async baseSelect(sql: string = '') {
    const base = await this.db.query<
      {
        c: Categoria;
        i: Item;
        ii: InstanciaItem;
        cf: CampoFormulario;
        o: Opcao;
      }[]
    >(`
      SELECT *
      FROM categoria c
      LEFT JOIN item i
      ON c.id = i.categoria_id
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
        return item.c.id;
      },
      format(group): CategoriaWithRelations {
        return {
          ...group[0].c,
          itens: group[0].i.id
            ? groupArray(group, {
                by(item) {
                  return item.i.id;
                },
                format(group) {
                  return {
                    ...group[0].i,
                    instancia_ativa: group[0].ii,
                    campos: group[0].cf.id
                      ? groupArray(group, {
                          by(item) {
                            return item.cf.id;
                          },
                          format(group) {
                            return {
                              ...group[0].cf,
                              opcoes: group[0].o.id
                                ? group.map((item) => item.o)
                                : [],
                            };
                          },
                        })
                      : [],
                  };
                },
              })
            : [],
        };
      },
    });
  }

  async findByRestaurateId(restauranteId: number) {
    const categorias = await this.baseSelect(
      `WHERE c.restaurante_id = ${restauranteId}`,
    );

    return categorias;
  }

  async getById(id: number) {
    const [categoria] = await this.baseSelect(`WHERE c.id = ${inject(id)}`);

    if (!categoria) {
      return null;
    }

    return categoria;
  }
}
