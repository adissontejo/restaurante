import { Injectable } from '@nestjs/common';
import { CreatePedidoDTO } from './dtos/create-pedido.dto';
import { PedidoMapper } from './mappers/pedido.mapper';
import { PedidoRepository } from './pedido.repository';
import { PedidoWithRelations } from './pedido.entity';
import { Transaction } from 'src/decorators/transaction.decorator';
import { RestauranteService } from '../restaurante/restaurante.service';
import { UsuarioService } from '../usuario/usuario.service';
import { FuncionarioService } from '../funcionario/funcionario.service';
import { ItemPedidoService } from '../item-pedido/item-pedido.service';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { Usuario } from '../usuario/usuario.entity';

@Injectable()
export class PedidoService {
  constructor(
    private readonly repository: PedidoRepository,
    private readonly restauranteService: RestauranteService,
    private readonly usuarioService: UsuarioService,
    private readonly funcionarioService: FuncionarioService,
    private readonly itemPedidoService: ItemPedidoService,
  ) {}

  @Transaction()
  async create(
    usuarioEmail: string | undefined,
    data: Omit<CreatePedidoDTO, 'usuarioId'>,
  ): Promise<PedidoWithRelations> {
    const restaurante = await this.restauranteService.getById(
      data.restauranteId,
    );
    const funcionario = await this.funcionarioService.getById(1);

    let usuario: Usuario | undefined = undefined;

    if (usuarioEmail) {
      usuario = await this.usuarioService.getByEmail(usuarioEmail);
    }

    const entity = PedidoMapper.fromCreateDTOToEntity({
      ...data,
      funcionarioResponsavelId: 1,
      usuarioId: usuario?.id,
    });

    const result = await this.repository.insert(entity);

    const itensPedido = await this.itemPedidoService.createItensForPedido(
      {
        ...entity,
        id: result.insertId,
      },
      data.itens,
    );

    return {
      ...entity,
      id: result.insertId,
      itens: itensPedido,
    };
  }

  @Transaction()
  async getByRestaurante(restauranteId: number, usuarioEmail: string) {
    const { funcionario } = await this.usuarioService.getFuncionarioByEmail(
      usuarioEmail,
      restauranteId,
    );

    if (!funcionario) {
      throw new AppException('Não autorizado', ExceptionType.UNAUTHORIZED);
    }

    return this.repository.getByRestauranteId(restauranteId);
  }

  async getByRestauranteAndUsuario(
    restauranteId: number,
    usuarioEmail?: string,
    unloggedIds?: number[],
  ) {
    let usuario: Usuario | undefined = undefined;

    if (usuarioEmail) {
      usuario = await this.usuarioService.getByEmail(usuarioEmail);
    }

    return this.repository.getByRestauranteAndUsuarioId(
      restauranteId,
      usuario?.id,
      unloggedIds,
    );
  }
}
