import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Socket } from 'socket.io';

export enum ExceptionType {
  INVALID_PARAMS,
  DATA_NOT_FOUND,
  DATA_ALREADY_EXISTS,
  UNAUTHORIZED,
}

export class AppException extends Error {
  body: any;
  type: ExceptionType;

  constructor(body: any, type: ExceptionType) {
    super(JSON.stringify(body));
    this.body = body;
    this.type = type;
  }
}

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private static readonly logger = new Logger(AppExceptionFilter.name);

  static getHttpStatus(type: ExceptionType) {
    switch (type) {
      case ExceptionType.INVALID_PARAMS:
        return HttpStatus.BAD_REQUEST;
      case ExceptionType.DATA_NOT_FOUND:
        return HttpStatus.NOT_FOUND;
      case ExceptionType.DATA_ALREADY_EXISTS:
        return HttpStatus.CONFLICT;
      case ExceptionType.UNAUTHORIZED:
        return HttpStatus.UNAUTHORIZED;
    }
  }

  static getBody(exception: Error) {
    if (exception instanceof AppException) {
      return {
        status: this.getHttpStatus(exception.type),
        errors: exception.body,
      };
    } else if (exception instanceof HttpException) {
      return {
        status: exception.getStatus(),
        message: exception.message,
      };
    } else {
      AppExceptionFilter.logger.error(exception.message, exception.stack);

      return {
        status: 500,
        errors: 'Internal Server Error',
      };
    }
  }

  catch(exception: AppException, host: ArgumentsHost) {
    const body = AppExceptionFilter.getBody(exception);

    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      response.status(body.status).json(body);
    } else if (host.getType() === 'ws') {
      const ctx = host.switchToWs();
      const client = ctx.getClient<Socket>();
      const pattern = ctx.getPattern();

      client.emit(`${pattern}_error`, body);
    }
  }
}
