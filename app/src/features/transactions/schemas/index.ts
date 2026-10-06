import { z } from 'zod';

import { amountSchema } from '@/lib/validators';

/** Agregar ingreso: monto, descripción, cuenta. Agregar gasto: además categoría. */
export const createTransactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: amountSchema,
  /** Opcional: vacío = la fila usa la categoría o "Ingreso"/"Gasto". */
  title: z.string().trim().max(60, 'Máximo 60 caracteres'),
  accountId: z.string().min(1, 'Elige una cuenta'),
  categoryId: z.string().nullable(),
});

export type CreateTransactionFormInput = z.infer<typeof createTransactionSchema>;
