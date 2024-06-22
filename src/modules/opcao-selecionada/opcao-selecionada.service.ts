import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/decorators/transaction.decorator';
import { OpcaoSelecionadaRepository } from './opcao-selecionada.repository';
import {
  OpcaoSelecionada,
  OpcaoSelecionadaWithRelations,
} from './opcao-selecionada.entity';
import {
  RespostaCampoFormulario,
  RespostaCampoFormularioWithRelations,
} from '../resposta-campo-formulario/resposta-campo-formulario.entity';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { Opcao } from '../opcao/opcao.entity';
import { groupArray } from 'src/utils/array';

@Injectable()
export class OpcaoSelecionadaService {
  constructor(private readonly repository: OpcaoSelecionadaRepository) {}

  @Transaction()
  async createManyForResposta(
    respostaCampoFormulario: RespostaCampoFormulario &
      Pick<RespostaCampoFormularioWithRelations, 'campo_formulario'>,
    opcoesIds: number[],
  ) {
    const entities = opcoesIds.map<OpcaoSelecionada>((item) => ({
      resposta_campo_formulario_id: respostaCampoFormulario.id,
      opcao_id: item,
    }));

    const groups = groupArray(opcoesIds, {
      by(item) {
        return item;
      },
    });

    if (groups.length !== opcoesIds.length) {
      throw new AppException(
        'Não pode selecionar a mesma opção mais de uma vez',
        ExceptionType.INVALID_PARAMS,
      );
    }

    const opcoes = opcoesIds.map((item) =>
      respostaCampoFormulario.campo_formulario.opcoes.find(
        (opcao) => opcao.id === item,
      ),
    );

    if (opcoes.some((opcao) => !opcao)) {
      throw new AppException(
        'Opção não encontrada',
        ExceptionType.DATA_NOT_FOUND,
      );
    }

    await this.repository.insertMany(entities);

    return entities.map<OpcaoSelecionadaWithRelations>((item, index) => ({
      ...item,
      opcao: opcoes[index] as Opcao,
    }));
  }
}
