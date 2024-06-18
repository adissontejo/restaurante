import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class CreateUsuarioValidator extends BaseValidator {

  get schema(): ZodSchema {

    return z.object({
      nome: z.string().min(3).max(100),
      email: z.string().min(3).max(100),
      dataNascimento: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      }),
      celular: z.string().min(3).max(100)
    });
  }
}
