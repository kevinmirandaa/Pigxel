import { z } from 'zod';

import { amountSchema, emojiSchema, initialAmountSchema, nameSchema } from '@/lib/validators';

export const createGoalSchema = z
  .object({
    name: nameSchema,
    icon: emojiSchema,
    targetAmount: amountSchema,
    initialAmount: initialAmountSchema,
  })
  .refine((g) => g.initialAmount <= g.targetAmount, {
    path: ['initialAmount'],
    message: 'No puede superar el monto objetivo',
  });

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
