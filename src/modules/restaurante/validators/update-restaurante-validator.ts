import { BaseValidator } from 'src/core/validator.core';
import { CreateHorarioRestauranteValidator } from 'src/modules/horario-restaurante/validators/create-horario-restaurante.validator';
import { ZodSchema, z } from 'zod';

export class UpdateRestauranteValidator extends BaseValidator {
  private readonly horarioValidator = new CreateHorarioRestauranteValidator();

  get schema(): ZodSchema {
    return z.object({
      nome: z.string().min(3).max(100).optional(),
      descricao: z.string().max(4000).nullish(),
      rua: z.string().min(3).max(100).optional(),
      numero: z.coerce.number().int().positive().optional(),
      cep: z.coerce
        .string()
        .regex(/^\d{8}$/)
        .optional(),
      complemento: z.string().max(100).nullish(),
      dominio: z
        .string()
        .min(3)
        .max(20)
        .regex(/^(?!-)[a-zA-Z0-9-]{1,63}(?<!-)$/)
        .optional(),
      horarios: z.array(this.horarioValidator.schema).nonempty().optional(),
      qtPedidosFidelidade: z.coerce.number().int().positive().nullish(),
      valorFidelidade: z.coerce.number().positive().nullish(),
    });
  }
}
