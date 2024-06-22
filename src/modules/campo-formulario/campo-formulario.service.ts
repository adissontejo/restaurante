import { Injectable } from '@nestjs/common';
import { CampoFormularioRepository } from './campo-formulario.repository';
import { CreateCampoFormularioDTO } from './dto/create-campo-formulario.dto';
import { CampoFormularioWithRelations } from './campo-formulario.entity';
import { CampoFormularioMapper } from './mapper/campo-formulario.mapper';
import { Transaction } from 'src/decorators/transaction.decorator';
import { OpcaoService } from '../opcao/opcao.service';
import { Opcao } from '../opcao/opcao.entity';
import { Item } from '../item/item.entity';

@Injectable()
export class CampoFormularioService {
  constructor(
    private readonly repository: CampoFormularioRepository,
    private readonly opcaoService: OpcaoService,
  ) {}

  @Transaction()
  async setCamposFormularioForItem(
    item: Item,
    data: CreateCampoFormularioDTO[],
  ) {
    await this.repository.setDeletadoForItemId(item.id);

    const camposFormulario = data.map((campo) =>
      CampoFormularioMapper.fromCreateDTOToEntity({
        ...campo,
        itemId: item.id,
      }),
    );

    if (!camposFormulario.length) {
      return [];
    }

    const result = await this.repository.insertMany(camposFormulario);

    const opcoesPromises = data.map((campo, index) => {
      if (campo.opcoes) {
        return this.opcaoService.unsafeCreateOpcoesForCampoFormularioId(
          result.insertId + index,
          campo.opcoes,
        );
      }

      return [] as Opcao[];
    });

    const opcoes = await Promise.all(opcoesPromises);

    return camposFormulario.map<CampoFormularioWithRelations>(
      (campo, index) => ({
        ...campo,
        id: result.insertId + index,
        opcoes: opcoes[index],
        item,
      }),
    );
  }
}
