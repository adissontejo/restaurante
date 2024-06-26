import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class UpdateCategoriaValidator extends BaseValidator {
  get schema(): ZodSchema {
    return z.object({
      nome: z.string().min(1).max(100).optional(),
    });
  }
}
