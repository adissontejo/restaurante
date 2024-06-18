import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class CreateContaValidator extends BaseValidator {

  get schema(): ZodSchema {

    return z.object({
      mes: z.coerce.number().int().positive(),
      valorTotal: z.coerce.number().nonnegative(),
      valorPago: z.coerce.number().nonnegative(),
      usuarioId: z.coerce.number().int().positive(),
      restauranteId: z.coerce.number().int().positive()
    });
  }
}
