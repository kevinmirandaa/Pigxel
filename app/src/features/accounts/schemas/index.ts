import { z } from 'zod';

import { emojiSchema, initialAmountSchema, nameSchema } from '@/lib/validators';

export const createAccountSchema = z.object({
  name: nameSchema,
  icon: emojiSchema,
  initialAmount: initialAmountSchema,
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
