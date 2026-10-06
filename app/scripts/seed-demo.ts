/// <reference types="node" />
/**
 * Carga los datos de los diseños para un usuario YA REGISTRADO (créalo antes desde la app).
 * Uso:  SEED_EMAIL=tu@correo.com SEED_PASSWORD='…' npm run seed:demo
 *       SEED_EMAIL=… SEED_PASSWORD=… npm run seed:demo -- --reset   (borra SOLO sus datos financieros)
 * Las credenciales se leen del entorno: nunca se escriben en código ni en archivos.
 */
import { createClient } from '@supabase/supabase-js';

import type { Database } from '../src/data/supabase/database.types';
import { createRepositoriesFromClient } from '../src/data/supabase/factory';
import { seedDemo } from './lib/seed-demo';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}.`);
  return value;
}

async function main() {
  const email = requireEnv('SEED_EMAIL');
  const password = requireEnv('SEED_PASSWORD');
  const reset = process.argv.includes('--reset');

  const client = createClient<Database>(
    requireEnv('EXPO_PUBLIC_SUPABASE_URL'),
    requireEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
  );
  const repos = createRepositoriesFromClient(client);

  try {
    await repos.auth.signIn({ email, password });
  } catch (e) {
    throw new Error(
      `No se pudo iniciar sesión como ${email}: ${(e as Error).message}\nCrea primero ese usuario desde la app (Crear cuenta).`,
    );
  }

  const result = await seedDemo({ client, repos, reset });
  const icon = result.status === 'seeded' ? '✅' : 'ℹ️';
  console.log(`${icon} ${result.message}`);
  console.log(
    `   cuentas: ${result.counts.accounts} · movimientos: ${result.counts.transactions} · suscripciones: ${result.counts.subscriptions} · objetivos: ${result.counts.goals}`,
  );
  if (result.status === 'seeded') {
    console.log(
      `   saldo total: ¢${(await repos.accounts.getTotalBalance()).toLocaleString('es-CR')}`,
    );
  }
  await repos.auth.signOut();
}

main().catch((e) => {
  console.error(`💥 ${(e as Error).message}`);
  process.exit(1);
});
