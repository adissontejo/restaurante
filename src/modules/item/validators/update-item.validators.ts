import { BaseValidator } from 'src/core/validator.core';
import { CreateCampoFormularioValidator } from 'src/modules/campo-formulario/validator/create-campo-formulario.validator';
import { ZodSchema, z } from 'zod';

export class UpdateItemValidator extends BaseValidator {
  private readonly campoValidator = new CreateCampoFormularioValidator();

  get schema(): ZodSchema {
    return z.object({
      nome: z.string().min(1).max(100).optional(),
      habilitado: z.preprocess(
        (value) =>
          typeof value === 'string' && value.length !== 0
            ? value === 'true'
            : value,
        z.boolean().optional(),
      ),
      preco: z.coerce.number().positive().optional(),
      campos: z.preprocess(
        (campos) =>
          typeof campos === 'string' && campos.length === 0 ? null : campos,
        z.array(this.campoValidator.schema).nullish(),
      ),
    });
  }
}
