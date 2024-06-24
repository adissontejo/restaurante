import { Injectable } from '@nestjs/common';
import { CupomRepository } from './cupom.repository';
import { Transaction } from 'src/decorators/transaction.decorator';
import { Restaurante } from '../restaurante/restaurante.entity';
import { Usuario } from '../usuario/usuario.entity';
import { AppException, ExceptionType } from 'src/core/exception.core';

@Injectable()
export class CupomService {
  constructor(private readonly repository: CupomRepository) {}

  @Transaction()
  async addForRestauranteAndUsuario(
    restaurante: Restaurante,
    usuario: Usuario,
  ) {
    const incomplete =
      await this.repository.getIncompleteByUsuarioAndRestaurante(
        usuario.id,
        restaurante.id,
      );

    if (incomplete) {
      await this.repository.updateById(incomplete.id, {
        qt_pedidos_feitos: incomplete.qt_pedidos_feitos + 1,
      });
    } else {
      if (!restaurante.valor_fidelidade || !restaurante.qt_pedidos_fidelidade) {
        return;
      }

      await this.repository.insert({
        usuario_id: usuario.id,
        restaurante_id: restaurante.id,
        desconto: restaurante.valor_fidelidade,
        qt_pedidos_feitos: 1,
        qt_pedidos_total: restaurante.qt_pedidos_fidelidade,
      });
    }
  }

  async getByUsuarioAndRestaurante(usuarioId: number, restauranteId: number) {
    return this.repository.getUnusedByUsuarioAndRestaurante(
      usuarioId,
      restauranteId,
    );
  }

  async getById(id: number) {
    const cupom = await this.repository.getById(id);

    if (!cupom) {
      throw new AppException(
        'Cupom não encontrado',
        ExceptionType.DATA_NOT_FOUND,
      );
    }

    return cupom;
  }
}
