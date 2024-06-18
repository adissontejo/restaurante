import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class CreateCupomValidator extends BaseValidator {

  get schema(): ZodSchema {

    return z.object({
      desconto: z.coerce.number().positive(),
      usuarioId: z.coerce.number().int().positive(),
      restauranteId: z.coerce.number().int().positive()
    });
  }
}
