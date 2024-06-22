import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class CreatePedidoValidator extends BaseValidator {
  get schema(): ZodSchema {
    return z.object({
      numeroMesa: z.coerce.number().positive(),
      observacao: z.string().max(400).nullish(),
    });
  }
}
