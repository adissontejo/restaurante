import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';
import { TipoCampo } from '../campo-formulario.entity';

export class CreateCampoFormularioValidator extends BaseValidator {
  get schema(): ZodSchema {
    return z.object({
      nome: z.string().min(3).max(100),
      tipoCampo: z.nativeEnum(TipoCampo),
      qtMinOpcoes: z.coerce.number().int().positive().nullish(),
      qtMaxOpcoes: z.coerce.number().int().positive().nullish(),
      opcoes: z.array(z.string().min(3).max(100)).nullish(),
    });
  }
}
