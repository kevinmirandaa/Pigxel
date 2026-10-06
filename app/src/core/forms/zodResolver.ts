import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form';
import type { z } from 'zod';

/**
 * Resolver de react-hook-form para esquemas zod con `coerce` (la entrada es texto, la salida números).
 * Devuelve el primer mensaje de cada campo; el valor final se obtiene con `schema.parse` al enviar.
 */
export function zodFormResolver<F extends FieldValues>(schema: z.ZodType): Resolver<F> {
  return async (values) => {
    const result = schema.safeParse(values);
    if (result.success) return { values: values as F, errors: {} };
    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join('.');
      if (!errors[key]) errors[key] = { type: issue.code, message: issue.message };
    }
    return { values: {}, errors: errors as FieldErrors<F> };
  };
}
