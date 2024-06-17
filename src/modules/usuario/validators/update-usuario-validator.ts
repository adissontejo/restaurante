import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class UpdateUsuarioValidator extends BaseValidator {

  get schema(): ZodSchema {
    return z.object({
        nome: z.string().min(3).max(100),
        email: z.string().min(3).max(100),
        data_nascimento: z.string().min(3).max(100),
        celular: z.string().min(3).max(100)
    });
  }
}
