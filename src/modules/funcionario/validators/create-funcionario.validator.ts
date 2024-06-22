import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';
import { Cargo } from '../funcionario.entity';

export class CreateFuncionarioValidator extends BaseValidator {
  get schema(): ZodSchema {
    return z.object({
      cargo: z.nativeEnum(Cargo),
      usuarioId: z.coerce.number().int().positive(),
      restauranteId: z.coerce.number().int().positive(),
    });
  }
}
