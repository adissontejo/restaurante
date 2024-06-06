import { BaseValidator } from 'src/core/validator.core';
import { CreateHorarioRestauranteValidator } from 'src/modules/horario-restaurante/validators/create-horario-restaurante.validator';
import { ZodSchema, z } from 'zod';

export class CreateRestauranteValidator extends BaseValidator {
  private readonly horarioValidator = new CreateHorarioRestauranteValidator();

  get schema(): ZodSchema {
    return z.object({
      nome: z.string().min(3).max(100),
      rua: z.string().min(3).max(100),
      numero: z.coerce.number().int().positive(),
      cep: z.coerce.string().regex(/^\d{8}$/),
      complemento: z.string().max(100).nullish(),
      dominio: z
        .string()
        .min(3)
        .max(20)
        .regex(/^(?!-)[a-zA-Z0-9-]{1,63}(?<!-)$/),
      horarios: z.array(this.horarioValidator.schema).nonempty(),
      qtPedidosFidelidade: z.coerce.number().int().positive().nullish(),
      valorFidelidade: z.coerce.number().positive().nullish(),
    });
  }
}
