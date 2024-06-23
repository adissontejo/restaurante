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
import { AuthService } from '../auth.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

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

        const token = request.headers['authorization'];

        const payload = await this.authService.verifyToken(token, optional);

        response.locals.user = payload;
      } else if (context.getType() === 'ws') {
        const ws = context.switchToWs();
        const client = ws.getClient<Socket>();

        const token = client.handshake.auth.token;

        const payload = await this.authService.verifyToken(token, optional);

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
