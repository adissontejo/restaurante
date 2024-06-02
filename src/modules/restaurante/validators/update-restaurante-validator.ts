import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class UpdateRestauranteValidator extends BaseValidator {
  protected schema(): ZodSchema {
    return z.object({
      nome: z.string().min(3).max(100).optional(),
      rua: z.string().min(3).max(100).optional(),
      numero: z.number().int().positive().optional(),
      cep: z
        .string()
        .regex(/^\d{8}$/)
        .optional(),
      complemento: z.string().max(100).nullish(),
      dominio: z
        .string()
        .min(3)
        .max(20)
        .regex(/^(?!-)[a-zA-Z0-9-]{1,63}(?<!-)$/)
        .optional(),
    });
  }
}
