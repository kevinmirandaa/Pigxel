import type { Repositories } from '../repositories';
import { getSupabase } from './client';
import { createRepositoriesFromClient } from './factory';

/** Repositorios sobre Supabase: los 7 son reales (Auth, Ajustes, cuentas, categorías, movimientos, suscripciones y objetivos). */
export function createSupabaseRepositories(): Repositories {
  return createRepositoriesFromClient(getSupabase());
}
