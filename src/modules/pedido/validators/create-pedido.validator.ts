import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class CreatePedidoValidator extends BaseValidator {
  get schema(): ZodSchema {
    return z.object({
      restauranteId: z.coerce.number().positive(),
      numeroMesa: z.coerce.number().positive(),
      observacao: z.string().max(400).nullish(),
      cupomId: z.coerce.number().int().positive().optional(),
      itens: z
        .array(
          z.object({
            instanciaItemId: z.coerce.number().int().positive(),
            quantidade: z.coerce.number().int().positive(),
            observacao: z.string().max(400).nullish(),
            respostas: z
              .array(
                z.object({
                  campoFormularioId: z.coerce.number().int().positive(),
                  opcoesIds: z
                    .array(z.coerce.number().int().positive())
                    .nullish(),
                  resposta: z.string().max(400).nullish(),
                }),
              )
              .nullish(),
          }),
        )
        .min(1),
    });
  }
}
