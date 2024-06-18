import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class UpdateFuncionarioValidator extends BaseValidator {

  get schema(): ZodSchema {
    return z.object({
        cargo: z.string().min(3).max(100).optional(),
        usuarioId: z.coerce.number().int().positive().optional(),
        restauranteId: z.coerce.number().int().positive().optional()
    });
  }
}
