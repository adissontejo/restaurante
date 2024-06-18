import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class UpdateCupomValidator extends BaseValidator {

  get schema(): ZodSchema {
    return z.object({
        desconto: z.coerce.number().positive().optional(),
        usuarioId: z.coerce.number().int().positive().optional(),
        restauranteId: z.coerce.number().int().positive().optional()
    });
  }
}
