import { Injectable } from '@nestjs/common';
import { CreatePedidoDTO } from './dtos/create-pedido.dto';
import { PedidoMapper } from './mappers/pedido.mapper';
import { PedidoRepository } from './pedido.repository';
import { PedidoWithRelations } from './pedido.entity';
import { Transaction } from 'src/decorators/transaction.decorator';

@Injectable()
export class PedidoService {
  constructor(private readonly repository: PedidoRepository) {}

  @Transaction()
  async create(dto: CreatePedidoDTO): Promise<PedidoWithRelations> {
    const entity = PedidoMapper.fromCreateDTOToEntity({
      ...dto,
      funcionarioResponsavelId: 1,
    });

    const result = await this.repository.insert(entity);

    return {
      ...entity,
      id: result.insertId,
    };
  }
}
