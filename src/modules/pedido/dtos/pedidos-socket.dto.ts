import { Socket } from 'socket.io';

export enum ConnectionType {
  ADMIN = 'ADMIN',
  KITCHEN = 'KITCHEN',
  WAITER = 'WAITER',
  CLIENT = 'CLIENT',
}

export enum SocketRoom {
  ADMIN = 'ADMIN',
  KITCHEN = 'KITCHEN',
  WAITER = 'WAITER',
  CLIENT = 'CLIENT',
  EMPLOYEE = 'EMPLOYEE',
}

export interface PedidosSocket extends Socket {
  handshake: Socket['handshake'] & {
    query: {
      restauranteId?: string;
      connectionType?: ConnectionType;
    };
  };
}
