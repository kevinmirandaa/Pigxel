/**
 * Integración REAL (lote 7.3): los formularios con sus mismos esquemas zod y los repositorios reales.
 * Uso: npm run test:forms-flow  ·  Crea un usuario @pigxel-test.dev (purgar desde el panel).
 */
import { createClient } from '@supabase/supabase-js';

import type { Database } from '../src/data/supabase/database.types';
import { createRepositoriesFromClient } from '../src/data/supabase/factory';
import { createAccountSchema } from '../src/features/accounts/schemas';
import { createCategorySchema } from '../src/features/categories/schemas';
import { createGoalSchema } from '../src/features/goals/schemas';
import { createSubscriptionSchema } from '../src/features/subscriptions/schemas';
import { createTransactionSchema } from '../src/features/transactions/schemas';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;
if (!url || !key) throw new Error('Falta EXPO_PUBLIC_SUPABASE_URL / ANON_KEY en .env');

let failures = 0;
let step = 0;
function check(label: string, ok: boolean, detail = '') {
  step += 1;
  if (!ok) failures += 1;
  console.log(`${ok ? '✅' : '❌'} ${step}. ${label}${detail ? ` → ${detail}` : ''}`);
}

async function main() {
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const repos = createRepositoriesFromClient(client);
  const stamp = Date.now();
  await repos.auth.signUp({
    name: 'Usuario Formularios',
    email: `qa-forms-${stamp}@pigxel-test.dev`,
    password: 'Pigxel-Test-1234',
  });

  // Los valores llegan como texto, igual que desde los campos.
  const account = await repos.accounts.create(
    createAccountSchema.parse({ name: ' Ahorros ', icon: '🏦', initialAmount: '100000' }),
  );
  check('cuenta con emoji y nombre recortado', account.name === 'Ahorros' && account.icon === '🏦');
  const empty = await repos.accounts.create(
    createAccountSchema.parse({ name: 'Cartera', icon: '👛', initialAmount: '' }),
  );
  check('monto inicial vacío = 0', empty.initialAmount === 0 && empty.balance === 0);

  const category = await repos.categories.create(
    createCategorySchema.parse({ name: 'Mascotas', icon: '🐶' }),
  );
  check('categoría creada', category.name === 'Mascotas' && category.icon === '🐶');
  let dup = '';
  try {
    await repos.categories.create(createCategorySchema.parse({ name: 'Mascotas', icon: '🐱' }));
  } catch (e) {
    dup = (e as Error).message;
  }
  check('categoría duplicada rechazada con mensaje en español', dup !== '', dup);

  const goal = await repos.goals.create(
    createGoalSchema.parse({
      name: 'Viaje',
      icon: '✈️',
      targetAmount: '500000',
      initialAmount: '50000',
    }),
  );
  check('objetivo creado', goal.targetAmount === 500000 && goal.icon === '✈️');
  check(
    'objetivo con inicial > meta no pasa el esquema',
    !createGoalSchema.safeParse({ name: 'X', icon: '✈️', targetAmount: '10', initialAmount: '20' })
      .success,
  );

  const sub = await repos.subscriptions.create(
    createSubscriptionSchema.parse({
      name: 'Netflix',
      icon: '🎬',
      cost: '6000',
      status: 'active',
      plan: 'monthly',
    }),
  );
  check(
    'suscripción creada',
    sub.cost === 6000 && sub.plan === 'monthly' && sub.status === 'active',
  );

  await repos.transactions.create(
    createTransactionSchema.parse({
      type: 'income',
      amount: '20000',
      title: 'Sueldo',
      accountId: account.id,
      categoryId: null,
    }),
  );
  await repos.transactions.create(
    createTransactionSchema.parse({
      type: 'expense',
      amount: '30000',
      title: '',
      accountId: account.id,
      categoryId: category.id,
    }),
  );
  const accounts = await repos.accounts.list();
  const updated = accounts.find((a) => a.id === account.id);
  check('saldo = 100.000 + 20.000 − 30.000', updated?.balance === 90000, `${updated?.balance}`);
  check('saldo total', (await repos.accounts.getTotalBalance()) === 90000);
  const list = await repos.transactions.list();
  check(
    '2 movimientos, el gasto sin descripción usa la categoría',
    list.length === 2 && list.some((t) => t.categoryLabel === 'Mascotas'),
    list.map((t) => `${t.type}:${t.title || '(vacío)'}`).join(', '),
  );
  check(
    'gasto mayor al saldo permitido',
    await repos.transactions
      .create(
        createTransactionSchema.parse({
          type: 'expense',
          amount: '500000',
          title: 'Grande',
          accountId: account.id,
          categoryId: null,
        }),
      )
      .then(
        () => true,
        () => false,
      ),
  );
  check(
    'saldo negativo permitido',
    ((await repos.accounts.list()).find((a) => a.id === account.id)?.balance ?? 0) < 0,
  );

  await repos.auth.signOut();
  console.log(
    `\n${failures === 0 ? '🎉 Todo OK' : `⚠️ ${failures} fallo(s)`} · usuario: qa-forms-${stamp}@pigxel-test.dev`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('💥 Error inesperado:', e);
  process.exit(1);
});
