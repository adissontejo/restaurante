import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { CreatePedidoDTO } from './dtos/create-pedido.dto';
import { PedidoService } from './pedido.service';
import {
  AppException,
  AppExceptionFilter,
  ExceptionType,
} from 'src/core/exception.core';
import { CreatePedidoValidator } from './validators/create-pedido.validator';
import { ParseIntPipe, UseFilters } from '@nestjs/common';
import { ConnectionType } from './dtos/pedidos-socket.dto';
import { AuthService } from '../auth/auth.service';
import { PedidoWithRelations } from './pedido.entity';
import { PedidoMapper } from './mappers/pedido.mapper';
import { ItemPedidoService } from '../item-pedido/item-pedido.service';
import { StatusItemPedido } from '../item-pedido/item-pedido.entity';

@WebSocketGateway({
  namespace: 'pedidos',
  cors: {
    origin: '*',
  },
})
@UseFilters(AppExceptionFilter)
export class PedidoGateway implements OnGatewayConnection {
  @WebSocketServer()
  private readonly namespace: Namespace;

  constructor(
    private readonly service: PedidoService,
    private readonly authService: AuthService,
    private readonly itemPedidoService: ItemPedidoService,
  ) {}

  private getRestauranteId(client: Socket) {
    const restauranteId = Number(client.handshake.query.restauranteId);

    if (isNaN(restauranteId)) {
      throw new AppException(
        'restauranteId é necessário na query da conexão',
        ExceptionType.INVALID_PARAMS,
      );
    }

    return restauranteId;
  }

  private getConnectionType(client: Socket) {
    const connectionType = client.handshake.query
      .connectionType as ConnectionType;

    if (
      !connectionType ||
      !Object.values(ConnectionType).includes(connectionType)
    ) {
      throw new AppException(
        'connectionType é necessário na query da conexão',
        ExceptionType.INVALID_PARAMS,
      );
    }

    return connectionType;
  }

  private getUnloggedIds(client: Socket) {
    const unloggedIds = client.handshake.query.unloggedIds;

    if (typeof unloggedIds === 'string') {
      return unloggedIds
        .split(',')
        .map(Number)
        .filter((item) => !isNaN(item));
    }
  }

  private broadcast(client: Socket, event: string, ...params: any[]) {
    const restauranteId = this.getRestauranteId(client);

    client.to(`restaurante:${restauranteId}`).emit(event, ...params);
  }

  private broadcastToRoom(
    client: Socket,
    room: string,
    event: string,
    ...params: any[]
  ) {
    const restauranteId = this.getRestauranteId(client);

    const restauranteSids = this.namespace.adapter.rooms.get(
      `restaurante:${restauranteId}`,
    );
    const roomSids = this.namespace.adapter.rooms.get(room);

    restauranteSids?.forEach((sid) => {
      if (!roomSids?.has(sid) || sid === client.id) {
        return;
      }

      const connected = this.namespace.sockets.get(sid);

      connected?.emit(event, ...params);
    });
  }

  async handleConnection(client: Socket) {
    try {
      const restauranteId = this.getRestauranteId(client);
      const connectionType = this.getConnectionType(client);
      const unloggedIds = this.getUnloggedIds(client);
      const user = await this.authService.verifyToken(
        client.handshake.auth.token,
        connectionType !== ConnectionType.FUNCIONARIO,
      );

      client.handshake.auth.user = user;

      let pedidos: PedidoWithRelations[];

      if (connectionType === ConnectionType.FUNCIONARIO) {
        pedidos = await this.service.getByRestaurante(
          restauranteId,
          user?.email as string,
        );
      } else {
        pedidos = await this.service.getByRestauranteAndUsuario(
          restauranteId,
          user?.email,
          unloggedIds,
        );

        pedidos.forEach((pedido) => {
          client.join(`pedido:${pedido.id}`);
          pedido.itens.forEach((item) => client.join(`item-pedido:${item.id}`));
        });
      }

      client.join(`restaurante:${restauranteId}`);
      client.join(connectionType);
      client.emit('connection_response', {
        pedidos: pedidos.map(PedidoMapper.fromEntityToResponseDTO),
      });
    } catch (err) {
      client.emit('connection_error', AppExceptionFilter.getBody(err));

      setTimeout(() => client.disconnect(), 1000);
    }
  }

  @SubscribeMessage('create')
  async create(
    @ConnectedSocket() client: Socket,
    @MessageBody(CreatePedidoValidator)
    dto: Omit<CreatePedidoDTO, 'usuarioId' | 'restauranteId'>,
  ) {
    const restauranteId = this.getRestauranteId(client);
    const connectionType = this.getConnectionType(client);

    const pedido = await this.service.create(
      connectionType === ConnectionType.CLIENTE
        ? client.handshake.auth.user?.email
        : undefined,
      {
        ...dto,
        restauranteId,
      },
    );

    if (connectionType === ConnectionType.CLIENTE) {
      client.join(`pedido:${pedido.id}`);
      pedido.itens.forEach((item) => client.join(`item-pedido:${item.id}`));
    }

    this.broadcastToRoom(
      client,
      ConnectionType.FUNCIONARIO,
      'created',
      PedidoMapper.fromEntityToResponseDTO(pedido),
    );

    client.emit(
      'create_response',
      PedidoMapper.fromEntityToResponseDTO(pedido),
    );
  }

  @SubscribeMessage('start')
  async start(
    @ConnectedSocket() client: Socket,
    @MessageBody(ParseIntPipe) pedidoId: number,
  ) {
    const restauranteId = this.getRestauranteId(client);
    const connectionType = this.getConnectionType(client);

    if (connectionType !== ConnectionType.FUNCIONARIO) {
      throw new AppException('Sem autorização', ExceptionType.UNAUTHORIZED);
    }

    await this.service.start(pedidoId, restauranteId);

    this.broadcastToRoom(
      client,
      ConnectionType.FUNCIONARIO,
      'started',
      pedidoId,
    );
    this.broadcastToRoom(client, `pedido:${pedidoId}`, 'started', pedidoId);
    client.emit('start_response');
  }

  @SubscribeMessage('finish-item')
  async finishItem(
    @ConnectedSocket() client: Socket,
    @MessageBody(ParseIntPipe) itemPedidoId: number,
  ) {
    const connectionType = this.getConnectionType(client);

    if (connectionType !== ConnectionType.FUNCIONARIO) {
      throw new AppException('Sem autorização', ExceptionType.UNAUTHORIZED);
    }

    await this.itemPedidoService.updateStatus(
      itemPedidoId,
      StatusItemPedido.FINALIZADO,
    );

    this.broadcastToRoom(
      client,
      ConnectionType.FUNCIONARIO,
      'item-finished',
      itemPedidoId,
    );
    this.broadcastToRoom(
      client,
      `item-pedido:${itemPedidoId}`,
      'item-finished',
      itemPedidoId,
    );
    client.emit('finish-item_response');
  }

  @SubscribeMessage('cancel-item')
  async cancelItem(
    @ConnectedSocket() client: Socket,
    @MessageBody(ParseIntPipe) itemPedidoId: number,
  ) {
    const connectionType = this.getConnectionType(client);

    if (connectionType !== ConnectionType.FUNCIONARIO) {
      throw new AppException('Sem autorização', ExceptionType.UNAUTHORIZED);
    }

    await this.itemPedidoService.updateStatus(
      itemPedidoId,
      StatusItemPedido.CANCELADO,
    );

    this.broadcastToRoom(
      client,
      ConnectionType.FUNCIONARIO,
      'item-canceled',
      itemPedidoId,
    );
    this.broadcastToRoom(
      client,
      `item-pedido:${itemPedidoId}`,
      'item-canceled',
      itemPedidoId,
    );
    client.emit('cancel-item_response');
  }
}
