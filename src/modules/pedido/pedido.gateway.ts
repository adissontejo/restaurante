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
import { UseFilters } from '@nestjs/common';
import { ConnectionType } from './dtos/pedidos-socket.dto';
import { AuthService } from '../auth/auth.service';
import { PedidoWithRelations } from './pedido.entity';
import { UseAuthentication } from '../auth/decorators/use-authentication.decorator';
import { GoogleUser } from '../auth/decorators/google-user.decorator';
import { UserProfileDTO } from 'src/services/google';

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
      if (!roomSids?.has(sid)) {
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
      const user = await this.authService.verifyToken(
        client.request.headers.authorization,
        connectionType !== ConnectionType.FUNCIONARIO,
      );

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
        );
      }

      client.join(`restaurante:${restauranteId}`);
      client.join(connectionType);
      client.emit('connection_response', { pedidos });
    } catch (err) {
      client.emit('connection_error', AppExceptionFilter.getBody(err));

      setTimeout(() => client.disconnect(), 1000);
    }
  }

  @SubscribeMessage('create')
  @UseAuthentication({ optional: true })
  async create(
    @ConnectedSocket() client: Socket,
    @MessageBody(CreatePedidoValidator)
    dto: Omit<CreatePedidoDTO, 'usuarioId' | 'restauranteId'>,
    @GoogleUser() user?: UserProfileDTO,
  ) {
    const restauranteId = this.getRestauranteId(client);

    const pedido = await this.service.create(user?.email, {
      ...dto,
      restauranteId,
    });

    this.broadcastToRoom(client, ConnectionType.FUNCIONARIO, 'created', pedido);

    client.emit('create_response', pedido);
  }
}
