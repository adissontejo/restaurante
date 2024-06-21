import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Response } from 'express';
import { Socket } from 'socket.io';
import { UserProfileDTO } from 'src/services/google';

export const GoogleUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserProfileDTO => {
    if (ctx.getType() === 'http') {
      const response = ctx.switchToHttp().getResponse<Response>();

      return response.locals.user;
    } else if (ctx.getType() === 'ws') {
      const socket = ctx.switchToWs().getClient<Socket>();

      return socket.handshake.auth.user;
    } else {
      throw new Error('Unsupported protocol');
    }
  },
);
