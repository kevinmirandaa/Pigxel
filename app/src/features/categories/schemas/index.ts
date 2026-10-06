import { z } from 'zod';

import { emojiSchema, nameSchema } from '@/lib/validators';

export const createCategorySchema = z.object({
  name: nameSchema,
  icon: emojiSchema,
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
