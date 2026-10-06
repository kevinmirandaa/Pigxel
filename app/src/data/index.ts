import { env } from '@/core/config/env';

import { createMockRepositories } from './mock';
import type { Repositories } from './repositories';
import { createSupabaseRepositories } from './supabase';

export * from './models';
export type * from './repositories';

let repositories: Repositories | null = null;

/** Único punto de acceso a datos para las features (mock o Supabase según el entorno). */
export function getRepositories(): Repositories {
  if (!repositories) {
    repositories =
      env.dataSource === 'supabase' ? createSupabaseRepositories() : createMockRepositories();
  }
  return repositories;
}
