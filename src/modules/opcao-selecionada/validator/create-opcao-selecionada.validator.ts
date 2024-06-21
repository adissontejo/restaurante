import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class CreateOpSelecionadaValidator extends BaseValidator {

  get schema(): ZodSchema {
    return z.object({
        resposta_campo_formulario_id: z.coerce.number().int().positive(),
        opcao_id: z.coerce.number().int().positive(),
    });
  }
}
