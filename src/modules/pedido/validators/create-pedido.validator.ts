import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';

export class CreatePedidoValidator extends BaseValidator {
  get schema(): ZodSchema {
    return z.object({
      restauranteId: z.coerce.number().positive(),
      usuarioId: z.coerce.number().positive(),
      funcionarioId: z.coerce.number().positive().nullish(),
      numeroMesa: z.coerce.number().positive(),
      observacao: z.string().max(400).nullish(),
      itens: z
        .array(
          z.object({
            instanciaItemId: z.coerce.number().positive(),
            quantidade: z.coerce.number().positive(),
            observacao: z.string().max(400).nullish(),
            respostas: z
              .array(
                z.object({
                  campoFormularioId: z.coerce.number().positive(),
                  opcoesIds: z.array(z.coerce.number().positive()).nullish(),
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
