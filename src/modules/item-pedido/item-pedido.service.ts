import { AppException, ExceptionType } from 'src/core/exception.core';
import { InstanciaItemService } from '../instancia-item/instancia-item.service';
import { Pedido } from '../pedido/pedido.entity';
import { CreateItemPedidoDTO } from './dtos/create-item-pedido.dto';
import { ItemPedidoMapper } from './mappers/item-pedido.mapper';
import { ItemPedidoRepository } from './item-pedido.repository';
import { RespostaCampoFormularioService } from '../resposta-campo-formulario/resposta-campo-formulario.service';
import {
  ItemPedidoWithRelations,
  StatusItemPedido,
} from './item-pedido.entity';
import { RespostaCampoFormularioWithRelations } from '../resposta-campo-formulario/resposta-campo-formulario.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemPedidoService {
  constructor(
    private readonly repository: ItemPedidoRepository,
    private readonly instanciaItemService: InstanciaItemService,
    private readonly respostaCampoFormularioService: RespostaCampoFormularioService,
  ) {}

  async createItensForPedido(
    pedido: Pedido,
    data: Omit<CreateItemPedidoDTO, 'pedidoId'>[],
  ) {
    const entities = data.map((item) =>
      ItemPedidoMapper.fromCreateDTOToEntity({ ...item, pedidoId: pedido.id }),
    );

    const instanciaItemsPromise = entities.map((item) =>
      this.instanciaItemService.getById(item.instancia_item_id),
    );

    const instanciaItems = await Promise.all(instanciaItemsPromise);

    instanciaItems.forEach((item) => {
      if (item.item.categoria.restaurante_id !== pedido.restaurante_id) {
        throw new AppException(
          `Item de id ${item.item.id} inválido para o restauranteId ${pedido.restaurante_id}`,
          ExceptionType.INVALID_PARAMS,
        );
      } else if (!item.item.habilitado) {
        throw new AppException(
          `Item de id ${item.item.id} desabilitado`,
          ExceptionType.INVALID_PARAMS,
        );
      } else if (!item.ativa) {
        throw new AppException(
          `Item de id ${item.item_id} desatualizado`,
          ExceptionType.INVALID_PARAMS,
        );
      }
    });

    const result = await this.repository.insertMany(entities);

    const respostasPromise = data.map((item, index) =>
      item.respostas
        ? this.respostaCampoFormularioService.createManyForItemPedido(
            {
              ...entities[index],
              id: result.insertId + index,
              instancia_item: instanciaItems[index],
            },
            item.respostas,
          )
        : ([] as RespostaCampoFormularioWithRelations[]),
    );

    const respostas = await Promise.all(respostasPromise);

    return entities.map<ItemPedidoWithRelations>((item, index) => ({
      ...item,
      id: result.insertId + index,
      instancia_item: instanciaItems[index],
      respostas: respostas[index],
    }));
  }

  async updateStatus(id: number, status: StatusItemPedido) {
    if (!Object.values(StatusItemPedido).includes(status)) {
      throw new AppException('Status inválido!', ExceptionType.INVALID_PARAMS);
    }

    await this.repository.updateStatusById(id, status);
  }
}
