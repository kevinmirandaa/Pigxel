import 'react-native-url-polyfill/auto';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

import { env } from '@/core/config/env';

import { chunkedSecureStore } from './chunkedSecureStore';
import type { Database } from './database.types';

let client: SupabaseClient<Database> | null = null;

/** Cliente único y tipado. Solo usa la anon key: la service_role NUNCA va en la app. */
export function getSupabase(): SupabaseClient<Database> {
  if (client) return client;
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error('Supabase no está configurado: define EXPO_PUBLIC_SUPABASE_URL y _ANON_KEY.');
  }

  client = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      storage: chunkedSecureStore,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  const supabase = client;
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });

  return client;
}
