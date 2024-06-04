import { PipeTransform } from '@nestjs/common';
import { AppException, ExceptionType } from './exception.core';
import { ZodError, ZodSchema } from 'zod';

export abstract class BaseValidator implements PipeTransform {
  transform(value: any) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppException(error.issues, ExceptionType.INVALID_PARAMS);
      }
    }
  }

  abstract get schema(): ZodSchema;
}
