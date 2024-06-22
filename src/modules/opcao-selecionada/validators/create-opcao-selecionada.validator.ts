import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class CreateOpcaoSelecionadaValidator extends BaseValidator {
  get schema(): ZodSchema {
    return z.array(z.number().positive());
  }
}
