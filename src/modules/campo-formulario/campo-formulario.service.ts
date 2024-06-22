import { Injectable } from '@nestjs/common';
import { CampoFormularioRepository } from './campo-formulario.repository';
import { CreateCampoFormularioDTO } from './dto/create-campo-formulario.dto';
import { CampoFormularioWithRelations } from './campo-formulario.entity';
import { CampoFormularioMapper } from './mapper/campo-formulario.mapper';
import { Transaction } from 'src/decorators/transaction.decorator';
import { OpcaoService } from '../opcao/opcao.service';
import { Opcao } from '../opcao/opcao.entity';

@Injectable()
export class CampoFormularioService {
  constructor(
    private readonly repository: CampoFormularioRepository,
    private readonly opcaoService: OpcaoService,
  ) {}

  @Transaction()
  async unsafeSetCamposFormularioForItem(
    itemId: number,
    data: CreateCampoFormularioDTO[],
  ) {
    await this.repository.setDeletadoForItemId(itemId);

    const camposFormulario = data.map((item) =>
      CampoFormularioMapper.fromCreateDTOToEntity({ ...item, itemId }),
    );

    if (!camposFormulario.length) {
      return [];
    }

    const result = await this.repository.insertMany(camposFormulario);

    const opcoesPromises = data.map((item, index) => {
      if (item.opcoes) {
        return this.opcaoService.unsafeCreateOpcoesForCampoFormularioId(
          result.insertId + index,
          item.opcoes,
        );
      }

      return [] as Opcao[];
    });

    const opcoes = await Promise.all(opcoesPromises);

    return camposFormulario.map<CampoFormularioWithRelations>(
      (item, index) => ({
        ...item,
        id: result.insertId + index,
        opcoes: opcoes[index],
      }),
    );
  }
}
