import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class UpdateUsuarioValidator extends BaseValidator {

  get schema(): ZodSchema {
    return z.object({
        nome: z.string().min(3).max(100).optional(),
        email: z.string().min(3).max(100).optional(),
        dataNascimento: z.string().refine(val => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }).optional(),
        celular: z.string().min(3).max(100).optional()
    });
  }
}
