import { z } from 'zod';

import { amountSchema } from '@/lib/validators';

export const consultSchema = z.object({ amount: amountSchema });
export type ConsultInput = z.infer<typeof consultSchema>;
