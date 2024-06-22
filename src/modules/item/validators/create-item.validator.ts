import { BaseValidator } from 'src/core/validator.core';
import { CreateCampoFormularioValidator } from 'src/modules/campo-formulario/validator/create-campo-formulario.validator';
import { ZodSchema, z } from 'zod';

export class CreateItemValidator extends BaseValidator {
  private readonly campoValidator = new CreateCampoFormularioValidator();

  get schema(): ZodSchema {
    return z.object({
      nome: z.string().min(1).max(100),
      habilitado: z.coerce.boolean().optional(),
      categoriaId: z.coerce.number().int().positive(),
      preco: z.coerce.number().positive(),
      campos: z.array(this.campoValidator.schema).optional(),
    });
  }
}
