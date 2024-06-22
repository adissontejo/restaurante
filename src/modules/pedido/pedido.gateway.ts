import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { PedidosSocket, SocketRoom } from './dtos/pedidos-socket.dto';
import { CreatePedidoDTO } from './dtos/create-pedido.dto';
import { PedidoService } from './pedido.service';
import {
  AppException,
  AppExceptionFilter,
  ExceptionType,
} from 'src/core/exception.core';
import { CreatePedidoValidator } from './validators/create-pedido.validator';
import { UseFilters } from '@nestjs/common';

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

  constructor(private readonly service: PedidoService) {}

  private getRestauranteId(client: PedidosSocket) {
    const restauranteId = Number(client.handshake.query.restauranteId);

    if (isNaN(restauranteId)) {
      throw new AppException(
        'restauranteId é necessário na query da conexão',
        ExceptionType.INVALID_PARAMS,
      );
    }

    return restauranteId;
  }

  private getUsusarioId(client: PedidosSocket) {
    const usuarioId = Number(client.handshake.query.usuarioId);

    if (isNaN(usuarioId)) {
      throw new AppException(
        'usuarioId é necessário na query da conexão',
        ExceptionType.INVALID_PARAMS,
      );
    }

    return usuarioId;
  }

  private broadcastToRoom(
    client: PedidosSocket,
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
      if (!roomSids?.has(sid)) {
        return;
      }

      const connected = this.namespace.sockets.get(sid);

      connected?.emit(event, ...params);
    });
  }

  handleConnection(client: PedidosSocket) {
    try {
      const restauranteId = this.getRestauranteId(client);
      const usuarioId = this.getUsusarioId(client);

      client.join(`restaurante:${restauranteId}`);
      client.join(`usuario:${usuarioId}`);
      client.join(SocketRoom.EMPLOYEE);
    } catch (err) {
      client.emit('connection_error', AppExceptionFilter.getBody(err));

      setTimeout(() => client.disconnect(), 1000);
    }
  }

  @SubscribeMessage('create')
  async create(
    @ConnectedSocket() client: PedidosSocket,
    @MessageBody(CreatePedidoValidator)
    dto: Omit<CreatePedidoDTO, 'usuarioId' | 'restauranteId'>,
  ) {
    const restauranteId = this.getRestauranteId(client);
    const usuarioId = this.getUsusarioId(client);

    const pedido = await this.service.create({
      ...dto,
      restauranteId,
      usuarioId,
    });

    this.broadcastToRoom(client, SocketRoom.EMPLOYEE, 'created', pedido);

    client.emit('create_response', pedido);
  }
}
