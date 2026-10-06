import { z } from 'zod';

const schema = z
  .object({
    dataSource: z.enum(['mock', 'supabase']).default('mock'),
    supabaseUrl: z.string().url().optional(),
    supabaseAnonKey: z.string().min(1).optional(),
    mockSignedIn: z.boolean().default(false),
    supportEmail: z.string().email().optional(),
  })
  .superRefine((env, ctx) => {
    if (env.dataSource === 'supabase') {
      if (!env.supabaseUrl) {
        ctx.addIssue({
          code: 'custom',
          path: ['supabaseUrl'],
          message: 'EXPO_PUBLIC_SUPABASE_URL es obligatoria con DATA_SOURCE=supabase',
        });
      }
      if (!env.supabaseAnonKey) {
        ctx.addIssue({
          code: 'custom',
          path: ['supabaseAnonKey'],
          message: 'EXPO_PUBLIC_SUPABASE_ANON_KEY es obligatoria con DATA_SOURCE=supabase',
        });
      }
    }
  });

/** Expo solo inlinea `process.env.EXPO_PUBLIC_*` si se referencian literalmente. */
const raw = {
  dataSource: process.env.EXPO_PUBLIC_DATA_SOURCE || undefined,
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || undefined,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || undefined,
  mockSignedIn: process.env.EXPO_PUBLIC_MOCK_SIGNED_IN === 'true',
  supportEmail: process.env.EXPO_PUBLIC_SUPPORT_EMAIL || undefined,
};

const parsed = schema.safeParse(raw);
if (!parsed.success) {
  throw new Error(
    `Configuración de entorno inválida:\n${parsed.error.issues
      .map((i) => `- ${i.path.join('.')}: ${i.message}`)
      .join('\n')}\nRevisa tu archivo .env (ver .env.example).`,
  );
}

export const env = parsed.data;
export type DataSource = typeof env.dataSource;
