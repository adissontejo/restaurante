import { PipeTransform, UsePipes } from '@nestjs/common';
import { AppException, ExceptionType } from './exception.core';
import { ZodError, ZodSchema } from 'zod';

export abstract class BaseValidator implements PipeTransform {
  transform(value: any) {
    const schema = this.schema();

    try {
      schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppException(error.issues, ExceptionType.INVALID_PARAMS);
      }
    }

    return value;
  }

  protected abstract schema(): ZodSchema;
}

export const Validate = (validator: new () => BaseValidator) =>
  UsePipes(validator);
