import { BaseValidator } from 'src/core/validator.core';
import { CreateCampoFormularioValidator } from 'src/modules/campo-formulario/validator/create-campo-formulario.validator';
import { ZodSchema, z } from 'zod';

export class UpdateItemValidator extends BaseValidator {
  private readonly campoValidator = new CreateCampoFormularioValidator();

  get schema(): ZodSchema {
    return z.object({
      nome: z.string().min(1).max(100).optional(),
      habilitado: z.coerce.boolean().optional(),
      preco: z.coerce.number().positive().optional(),
      campos: z.array(this.campoValidator.schema).optional(),
    });
  }
}
