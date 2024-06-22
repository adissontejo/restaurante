import { Injectable } from '@nestjs/common';
import { OpcaoRepository } from './opcao.repository';
import { Opcao } from './opcao.entity';
import { Transaction } from 'src/decorators/transaction.decorator';

@Injectable()
export class OpcaoService {
  constructor(private readonly repository: OpcaoRepository) {}

  @Transaction()
  async unsafeCreateOpcoesForCampoFormularioId(
    campoFormularioId: number,
    textos: string[],
  ) {
    if (!textos.length) {
      return [];
    }

    const opcoes = textos.map<Omit<Opcao, 'id'>>((texto) => ({
      campo_formulario_id: campoFormularioId,
      texto,
    }));

    const result = await this.repository.insertMany(opcoes);

    return opcoes.map<Opcao>((opcao, index) => ({
      ...opcao,
      id: result.insertId + index,
    }));
  }
}
