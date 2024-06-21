import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class InstanciaItemValidator extends BaseValidator {

  get schema(): ZodSchema {
    return z.object({
        preco: z.coerce.number().int().positive(),
        ativa: z.coerce.boolean(),
        item_id: z.coerce.number().int().positive(),
    });
  }
}
