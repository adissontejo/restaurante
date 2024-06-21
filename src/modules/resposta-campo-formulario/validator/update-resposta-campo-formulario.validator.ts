import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class CreateRCampoFormularioValidator extends BaseValidator {

  get schema(): ZodSchema {
    return z.object({
      resposta: z.string().min(1).max(400).optional(),
      campo_formulario_id: z.coerce.number().int().positive().optional(),
      item_pedido_id: z.coerce.number().int().positive().optional(),
    });
  }
}
