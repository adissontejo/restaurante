import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/database.service';
import { Pedido, PedidoWithRelations } from './pedido.entity';
import {
  generateInsertBody,
  generateUpdateSetters,
  inject,
} from 'src/utils/sql';
import { ItemPedido } from '../item-pedido/item-pedido.entity';
import { RespostaCampoFormulario } from '../resposta-campo-formulario/resposta-campo-formulario.entity';
import { OpcaoSelecionada } from '../opcao-selecionada/opcao-selecionada.entity';
import { InstanciaItem } from '../instancia-item/instancia-item.entity';
import { Item } from '../item/item.entity';
import { CampoFormulario } from '../campo-formulario/campo-formulario.entity';
import { Opcao } from '../opcao/opcao.entity';
import { groupArray } from 'src/utils/array';
import { Funcionario } from '../funcionario/funcionario.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Cupom } from '../cupom/cupom.entity';

@Injectable()
export class PedidoRepository {
  constructor(private readonly db: Database) {}

  async insert(pedido: Omit<Pedido, 'id'>) {
    const result = await this.db.query(`
      INSERT INTO pedido ${generateInsertBody(pedido)}
    `);

    return result;
  }

  async updateById(id: number, pedido: Omit<Partial<Pedido>, 'id'>) {
    const result = await this.db.query(`
      UPDATE pedido
      SET ${generateUpdateSetters(pedido)}
      WHERE id = ${inject(id)}
    `);

    return result;
  }

  async deleteById(id: number) {
    const result = await this.db.query(`
      DELETE FROM pedido
      WHERE id = ${inject(id)}
    `);

    return result;
  }

  async baseSelect(sql: string = '') {
    const result = await this.db.query<
      {
        p: Pedido;
        ip: ItemPedido;
        ii: InstanciaItem;
        i: Item;
        rcp: RespostaCampoFormulario;
        cf: CampoFormulario;
        os: OpcaoSelecionada;
        o: Opcao;
        fr: Funcionario;
        fru: Usuario;
        c: Cupom;
      }[]
    >(`
      SELECT *
      FROM pedido p
      JOIN item_pedido ip
      ON p.id = ip.pedido_id
      JOIN instancia_item ii
      ON ip.instancia_item_id = ii.id
      JOIN item i
      ON ii.item_id = i.id
      LEFT JOIN resposta_campo_formulario rcp
      ON ip.id = rcp.item_pedido_id
      LEFT JOIN campo_formulario cf
      ON rcp.campo_formulario_id = cf.id
      LEFT JOIN opcao_selecionada os
      ON rcp.id = os.resposta_campo_formulario_id
      LEFT JOIN opcao o
      ON os.opcao_id = o.id
      LEFT JOIN funcionario fr
      ON p.funcionario_responsavel_id = fr.id
      LEFT JOIN usuario fru
      ON fr.usuario_id = fru.id
      LEFT JOIN cupom c
      ON p.cupom_id = c.id
      ${sql}
    `);

    return groupArray(result, {
      by(item) {
        return item.p.id;
      },
      format(group): PedidoWithRelations {
        return {
          ...group[0].p,
          funcionario_responsavel: {
            ...group[0].fr,
            usuario: group[0].fru,
          },
          cupom: group[0].c,
          itens: groupArray(group, {
            by(item) {
              return item.ip.id;
            },
            format(group) {
              return {
                ...group[0].ip,
                instancia_item: {
                  ...group[0].ii,
                  item: group[0].i,
                },
                respostas: groupArray(group, {
                  by(item) {
                    return item.rcp.id;
                  },
                  format(group) {
                    return {
                      ...group[0].rcp,
                      campo_formulario: group[0].cf,
                      opcoes: group.map((item) => ({
                        ...item.os,
                        opcao: item.o,
                      })),
                    };
                  },
                }),
              };
            },
          }),
        };
      },
    });
  }

  async getByRestauranteId(restauranteId: number) {
    const result = await this.baseSelect(`
      WHERE p.restaurante_id = ${inject(restauranteId)}
      ORDER BY data_hora DESC
    `);

    return result;
  }

  async getByRestauranteAndUsuarioId(
    restauranteId: number,
    usuarioId: number = -1,
    unloggedIds: number[] = [],
  ) {
    const result = await this.baseSelect(`
      WHERE p.restaurante_id = ${inject(restauranteId)}
      AND (
        p.usuario_id = ${usuarioId}
        OR (
          p.usuario_id IS NULL
          AND p.id IN (${inject(unloggedIds)})
        )
      )
      ORDER BY data_hora DESC
    `);

    return result;
  }

  async getById(id: number) {
    const [result] = await this.baseSelect(`WHERE p.id = ${id}`);

    if (!result) {
      return null;
    }

    return result;
  }

  async setIniciadoById(id: number) {
    const result = await this.db.query(`
      UPDATE pedido
      SET iniciado = TRUE
      WHERE id = ${inject(id)}
    `);

    return result;
  }

  async setFuncionarioById(id: number, funcionarioResponsavelId: number) {
    const result = await this.db.query(`
      UPDATE pedido
      SET funcionario_responsavel_id = ${inject(funcionarioResponsavelId)}
      WHERE id = ${inject(id)}
    `);

    return result;
  }
}
