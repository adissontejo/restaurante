import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class UpdateCampoFormularioValidator extends BaseValidator {

  get schema(): ZodSchema {
    return z.object({
      nome: z.string().min(1).max(100).optional(),
      tipo_campo: z.coerce.boolean().optional(),
      qt_min_opcoes: z.coerce.number().int().positive().optional(),
      qt_max_opcoes: z.coerce.number().int().positive().optional(),
      item_id: z.coerce.number().int().positive().optional(),
    });
  }
}
