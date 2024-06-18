import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class CreateItemValidator extends BaseValidator {

  get schema(): ZodSchema {
    return z.object({
      nome: z.string().min(1).max(100),
      habilitado: z.coerce.boolean(),
      restaurante_id: z.coerce.number().int().positive(),
    });
  }
}
