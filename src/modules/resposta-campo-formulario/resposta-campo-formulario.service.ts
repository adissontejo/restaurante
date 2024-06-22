import { Injectable } from '@nestjs/common';
import { RespostaCampoFormularioRepository } from './resposta-campo-formulario.repository';
import {
  ItemPedido,
  ItemPedidoWithRelations,
} from '../item-pedido/item-pedido.entity';
import { CreateRespostaCampoFormularioDTO } from './dtos/create-resposta-campo-formulario.dto';
import { groupArray } from 'src/utils/array';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { RespostaCampoFormularioMapper } from './mappers/resposta-campo-formulario.mapper';
import { RespostaCampoFormularioWithRelations } from './resposta-campo-formulario.entity';
import { Transaction } from 'src/decorators/transaction.decorator';
import { CampoFormularioWithRelations } from '../campo-formulario/campo-formulario.entity';
import { OpcaoSelecionadaService } from '../opcao-selecionada/opcao-selecionada.service';
import { OpcaoSelecionadaWithRelations } from '../opcao-selecionada/opcao-selecionada.entity';

@Injectable()
export class RespostaCampoFormularioService {
  constructor(
    private readonly repository: RespostaCampoFormularioRepository,
    private readonly opcaoSelecionadaService: OpcaoSelecionadaService,
  ) {}

  @Transaction()
  async createManyForItemPedido(
    itemPedido: ItemPedido & Pick<ItemPedidoWithRelations, 'instancia_item'>,
    data: Omit<CreateRespostaCampoFormularioDTO, 'itemPedidoId'>[],
  ) {
    const campos = data.map((item) =>
      itemPedido.instancia_item.item.campos.find(
        (campo) => campo.id === item.campoFormularioId,
      ),
    );

    if (campos.some((campo) => !campo)) {
      throw new AppException(
        'Campo não encontrado',
        ExceptionType.DATA_NOT_FOUND,
      );
    }

    const groups = groupArray(data, {
      by(item) {
        return item.campoFormularioId;
      },
    });

    if (data.length !== groups.length) {
      throw new AppException(
        'Não pode responder o mesmo campo mais de uma vez',
        ExceptionType.INVALID_PARAMS,
      );
    }

    const entities = data.map((item) =>
      RespostaCampoFormularioMapper.fromCreateDTOToEntity({
        ...item,
        itemPedidoId: itemPedido.id,
      }),
    );

    const result = await this.repository.insertMany(entities);

    const opcoes = await Promise.all(
      data.map((item, index) =>
        item.opcoesIds
          ? this.opcaoSelecionadaService.createManyForResposta(
              {
                ...entities[index],
                id: result.insertId,
                campo_formulario: campos[index] as Omit<
                  CampoFormularioWithRelations,
                  'item'
                >,
              },
              item.opcoesIds,
            )
          : ([] as OpcaoSelecionadaWithRelations[]),
      ),
    );

    return entities.map<RespostaCampoFormularioWithRelations>(
      (item, index) => ({
        ...item,
        id: result.insertId + index,
        opcoes: opcoes[index],
        campo_formulario: campos[index] as Omit<
          CampoFormularioWithRelations,
          'item'
        >,
      }),
    );
  }
}
