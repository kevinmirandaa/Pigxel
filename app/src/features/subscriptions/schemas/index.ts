import { z } from 'zod';

import { amountSchema, emojiSchema, nameSchema } from '@/lib/validators';

export const createSubscriptionSchema = z.object({
  name: nameSchema,
  icon: emojiSchema,
  cost: amountSchema,
  status: z.enum(['active', 'inactive']),
  plan: z.enum(['weekly', 'monthly', 'yearly']),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
