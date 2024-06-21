import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Socket } from 'socket.io';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { OptionalAuthentication } from '../decorators/optional-authentication.decorator';
import { getUserProfile } from 'src/services/google';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  async verifyToken(token?: string) {
    if (!token) {
      throw new AppException('Missing credentials', ExceptionType.UNAUTHORIZED);
    }

    try {
      const profile = await getUserProfile(token);

      return profile;
    } catch (err) {
      throw new AppException('Invalid credentials', ExceptionType.UNAUTHORIZED);
    }
  }

  async intercept(context: ExecutionContext, next: CallHandler) {
    const optional = this.reflector.get(
      OptionalAuthentication,
      context.getHandler(),
    );

    try {
      if (context.getType() === 'http') {
        const http = context.switchToHttp();
        const request = http.getRequest<Request>();
        const response = http.getResponse<Response>();

        const token = request.headers['authorization']?.split(' ')?.[1];

        const payload = await this.verifyToken(token);

        response.locals.user = payload;
      } else if (context.getType() === 'ws') {
        const ws = context.switchToWs();
        const client = ws.getClient<Socket>();

        const token = client.request.headers['authorization'];

        const payload = await this.verifyToken(token);

        client.handshake.auth.user = payload;
      }
    } catch (err) {
      if (
        !(err instanceof AppException) ||
        err.type !== ExceptionType.UNAUTHORIZED ||
        !optional
      ) {
        throw err;
      }
    }

    return next.handle();
  }
}
