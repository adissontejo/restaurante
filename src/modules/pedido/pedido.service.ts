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
import { Cupom } from '../cupom/cupom.entity';
import { CupomService } from '../cupom/cupom.service';

@Injectable()
export class PedidoService {
  constructor(
    private readonly repository: PedidoRepository,
    private readonly restauranteService: RestauranteService,
    private readonly usuarioService: UsuarioService,
    private readonly funcionarioService: FuncionarioService,
    private readonly itemPedidoService: ItemPedidoService,
    private readonly cupomService: CupomService,
  ) {}

  @Transaction()
  async create(
    usuarioEmail: string | undefined,
    data: Omit<CreatePedidoDTO, 'usuarioId'>,
  ): Promise<PedidoWithRelations> {
    const restaurante = await this.restauranteService.getById(
      data.restauranteId,
    );

    let usuario: Usuario | undefined = undefined;
    let cupom: Cupom | undefined = undefined;

    if (usuarioEmail) {
      usuario = await this.usuarioService.getByEmail(usuarioEmail);

      if (data.cupomId) {
        cupom = await this.cupomService.getById(data.cupomId);

        if (
          cupom.qt_pedidos_feitos < cupom.qt_pedidos_total ||
          cupom.usuario_id !== usuario.id
        ) {
          throw new AppException(
            'Cupom não pode ser usado',
            ExceptionType.INVALID_PARAMS,
          );
        }
      } else {
        await this.cupomService.addForRestauranteAndUsuario(
          restaurante,
          usuario,
        );
      }
    }

    const funcionarioResponsavel =
      await this.funcionarioService.getLessResponsible(data.restauranteId);

    const entity = PedidoMapper.fromCreateDTOToEntity({
      ...data,
      funcionarioResponsavelId: funcionarioResponsavel?.id,
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
      funcionario_responsavel: funcionarioResponsavel || undefined,
      cupom,
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

  @Transaction()
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

  async getById(id: number) {
    const pedido = await this.repository.getById(id);

    if (!pedido) {
      throw new AppException(
        'Pedido não encontrado',
        ExceptionType.DATA_NOT_FOUND,
      );
    }

    return pedido;
  }

  @Transaction()
  async start(id: number, restauranteId: number): Promise<PedidoWithRelations> {
    const pedido = await this.getById(id);

    if (pedido.restaurante_id !== restauranteId) {
      throw new AppException(
        'Pedido não encontrado',
        ExceptionType.DATA_NOT_FOUND,
      );
    }

    await this.repository.setIniciadoById(id);

    return {
      ...pedido,
      iniciado: true,
    };
  }

  @Transaction()
  async setFuncionarioResponsavel(
    id: number,
    funcionarioResponsavelId: number,
  ) {
    const funcionarioResponsavel = await this.funcionarioService.getById(
      funcionarioResponsavelId,
    );

    await this.repository.setFuncionarioById(id, funcionarioResponsavelId);

    return funcionarioResponsavel;
  }
}
