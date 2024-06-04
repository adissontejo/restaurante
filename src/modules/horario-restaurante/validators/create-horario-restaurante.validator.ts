import { BaseValidator } from 'src/core/validator.core';
import { ZodSchema, z } from 'zod';
import { extractTime } from 'src/utils/time';
import { DiaSemana } from '../horario-restaurante.entity';

export class CreateHorarioRestauranteValidator extends BaseValidator {
  get schema(): ZodSchema {
    const timeSchema = z
      .string()
      .regex(/^\d{2}:\d{2}(:\d{2}|)$/, 'Acceptable formats: hh:mm | hh:mm:ss')
      .refine((time) => {
        const { hours, minutes, seconds } = extractTime(time);

        return hours < 24 && minutes < 60 && (isNaN(seconds) || seconds < 60);
      }, 'Invalid time values');

    return z.object({
      abertura: timeSchema,
      fechamento: timeSchema,
      diaSemana: z.nativeEnum(DiaSemana),
    });
  }
}
