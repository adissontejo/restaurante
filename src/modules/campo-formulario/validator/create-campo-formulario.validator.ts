import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';
import { TipoCampo } from '../campo-formulario.entity';

export class CreateCampoFormularioValidator extends BaseValidator {
  get schema(): ZodSchema {
    return z.object({
      nome: z.string().min(3).max(100),
      tipoCampo: z.nativeEnum(TipoCampo),
      qtMinOpcoes: z.preprocess(
        (value) =>
          typeof value === 'string' && value.length === 0 ? null : value,
        z.coerce.number().int().positive().nullish(),
      ),
      qtMaxOpcoes: z.preprocess(
        (value) =>
          typeof value === 'string' && value.length === 0 ? null : value,
        z.coerce.number().int().positive().nullish(),
      ),
      opcoes: z.array(z.string().min(3).max(100)).nullish(),
      obrigatorio: z.preprocess(
        (value) => (typeof value === 'string' ? value === 'true' : value),
        z.coerce.boolean(),
      ),
    });
  }
}
