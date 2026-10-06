import type { createClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

/** Cliente Supabase tipado con el esquema de Pigxel (el tipo exacto que devuelve createClient). */
export type PigxelClient = ReturnType<typeof createClient<Database>>;
