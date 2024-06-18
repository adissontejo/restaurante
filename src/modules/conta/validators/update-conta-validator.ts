import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class UpdateContaValidator extends BaseValidator {

  get schema(): ZodSchema {
    return z.object({
        mes: z.coerce.number().int().positive().optional(),
        valorTotal: z.coerce.number().nonnegative().optional(),
        valorPago: z.coerce.number().nonnegative().optional(),
        usuarioId: z.coerce.number().int().positive().optional(),
        restauranteId: z.coerce.number().int().positive().optional()
    });
  }
}
