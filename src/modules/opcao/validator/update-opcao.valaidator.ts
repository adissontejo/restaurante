import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class UpdateOpcaoValidator extends BaseValidator {

  get schema(): ZodSchema {
    return z.object({
        texto: z.string().min(1).max(200),
        campo_formulario_id: z.coerce.number().int().positive(),
    });
  }
}
