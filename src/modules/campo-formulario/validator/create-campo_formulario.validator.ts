import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class CreateCampoFormularioValidator extends BaseValidator {

  get schema(): ZodSchema {
    return z.object({
      nome: z.string().min(1).max(100),
      tipo_campo: z.coerce.boolean(),
      qt_min_opcoes: z.coerce.number().int().positive(),
      qt_max_opcoes: z.coerce.number().int().positive(),
      item_id: z.coerce.number().int().positive(),
    });
  }
}
