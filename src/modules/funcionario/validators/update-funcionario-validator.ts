import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class UpdateFuncionarioValidator extends BaseValidator {

  get schema(): ZodSchema {
    return z.object({
        celular: z.string().min(3).max(100),
        cargo: z.string().min(3).max(100),
        usuario_id: z.number(),
        restaurante_id: z.number()
    });
  }
}
