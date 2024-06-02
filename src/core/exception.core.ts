import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

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

@Catch(AppException)
export class AppExceptionFilter implements ExceptionFilter {
  private getHttpStatus(type: ExceptionType) {
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

  catch(exception: AppException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = this.getHttpStatus(exception.type);

    let body = exception.body;

    if (typeof body === 'string') {
      body = { message: body };
    }

    response.status(status).json(body);
  }
}
