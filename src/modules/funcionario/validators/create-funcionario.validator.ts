import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class CreateFuncionarioValidator extends BaseValidator {

  get schema(): ZodSchema {

    return z.object({
      cargo: z.string().min(3).max(100),
      usuarioId: z.coerce.number().int().positive().nullish(),
      restauranteId: z.coerce.number().int().positive().nullish()
    });
  }
}
