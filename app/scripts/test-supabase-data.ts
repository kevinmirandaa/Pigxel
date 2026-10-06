/**
 * Prueba de integración REAL (etapa 2): cuentas, categorías y movimientos con emojis.
 * Uso: npm run test:supabase-data
 * Cliente de Node en memoria + repositorios reales contra el proyecto de .env.
 * Los usuarios de prueba quedan en Auth (no hay service_role): purgar desde el panel.
 */
import { createClient } from '@supabase/supabase-js';

import type { Database } from '../src/data/supabase/database.types';
import { createAccountRepository } from '../src/data/supabase/repositories/accounts';
import { createAuthRepository } from '../src/data/supabase/repositories/auth';
import { createCategoryRepository } from '../src/data/supabase/repositories/categories';
import { createTransactionRepository } from '../src/data/supabase/repositories/transactions';
import { weekdayIndex } from '../src/data/supabase/week';
import { validateEmoji } from '../src/lib/emoji';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta ${name} en .env`);
  return value;
}
const url = requireEnv('EXPO_PUBLIC_SUPABASE_URL');
const key = requireEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');

const newClient = () =>
  createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

let failures = 0;
let step = 0;
function check(label: string, ok: boolean, detail = '') {
  step += 1;
  if (!ok) failures += 1;
  console.log(`${ok ? '✅' : '❌'} ${step}. ${label}${detail ? ` → ${detail}` : ''}`);
}
async function expectError(label: string, fn: () => Promise<unknown>, expected: string) {
  try {
    await fn();
    check(label, false, 'no lanzó error');
  } catch (e) {
    const msg = (e as Error).message;
    check(label, msg === expected, `"${msg}"`);
  }
}
const codePoints = (s: string) => [...s].map((c) => (c.codePointAt(0) as number).toString(16));
/** Idéntico byte a byte (mismos code points), no solo "parecido". */
const identical = (a: string, b: string) =>
  a === b && codePoints(a).join() === codePoints(b).join();
const money = (n: number) => `¢${n.toLocaleString('es-CR')}`;

interface Session {
  client: ReturnType<typeof newClient>;
  auth: ReturnType<typeof createAuthRepository>;
  accounts: ReturnType<typeof createAccountRepository>;
  categories: ReturnType<typeof createCategoryRepository>;
  transactions: ReturnType<typeof createTransactionRepository>;
}
function session(): Session {
  const client = newClient();
  return {
    client,
    auth: createAuthRepository(client),
    accounts: createAccountRepository(client),
    categories: createCategoryRepository(client),
    transactions: createTransactionRepository(client),
  };
}

async function main() {
  const stamp = Date.now();
  const password = 'Pigxel-Test-1234';
  const A = session();
  const B = session();

  // 1. Usuario A
  await A.auth.signUp({
    name: 'Usuario Datos',
    email: `qa-data-${stamp}@pigxel-test.dev`,
    password,
  });
  check('signUp usuario A', (await A.auth.getSession()) !== null);

  // 2. Categorías por defecto: 8, con emoji válido, orden alfabético
  const defaults = await A.categories.list();
  check('categorías por defecto = 8', defaults.length === 8, `${defaults.length}`);
  check(
    'todas con emoji válido',
    defaults.every((c) => validateEmoji(c.icon)),
    defaults.map((c) => `${c.icon}${c.name}`).join(' '),
  );
  const names = defaults.map((c) => c.name);
  const sorted = [...names].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
  check('orden alfabético', names.join() === sorted.join(), names.join(', '));
  const cat = (name: string) => defaults.find((c) => c.name === name);
  check(
    'emojis por defecto (☕ 🚗 🛒)',
    cat('Alimentación')?.icon === '☕' &&
      cat('Transporte')?.icon === '🚗' &&
      cat('Compras')?.icon === '🛒',
  );

  // 3. Cuentas BCR 🏛️ ¢20.000 y Efectivo 💵 ¢5.000
  const bcr = await A.accounts.create({ name: 'BCR', icon: '🏛️', initialAmount: 20_000 });
  const cash = await A.accounts.create({ name: 'Efectivo', icon: '💵', initialAmount: 5_000 });
  check(
    'cuenta BCR devuelve el emoji idéntico (🏛️ con selector)',
    identical(bcr.icon, '🏛️'),
    codePoints(bcr.icon).join(' '),
  );
  const listed = await A.accounts.list();
  check(
    'accounts.list: 2 cuentas en orden de creación con emoji idéntico',
    listed.length === 2 &&
      listed[0]?.name === 'BCR' &&
      listed[1]?.name === 'Efectivo' &&
      identical(listed[0].icon, '🏛️') &&
      identical(listed[1].icon, '💵'),
  );
  check(
    'saldos iniciales y total = ¢25.000',
    listed[0]?.balance === 20_000 &&
      listed[1]?.balance === 5_000 &&
      (await A.accounts.getTotalBalance()) === 25_000,
  );

  // 4. Categorías nuevas y duplicados
  const juegos = await A.categories.create({ name: 'Juegos', icon: '🎮' });
  check('categoría 🎮 Juegos creada', identical(juegos.icon, '🎮') && juegos.name === 'Juegos');
  await expectError(
    'duplicado "juegos" (otra capitalización) rechazado',
    () => A.categories.create({ name: 'juegos', icon: '🕹️' }),
    'Ya tienes una categoría con ese nombre',
  );
  const familia = '👨‍👩‍👧‍👦';
  const fam = await A.categories.create({ name: 'Familia', icon: familia });
  const famBack = (await A.categories.list()).find((c) => c.name === 'Familia');
  check(
    'emoji compuesto 👨‍👩‍👧‍👦 vuelve idéntico',
    identical(fam.icon, familia) && identical(famBack?.icon ?? '', familia),
    codePoints(famBack?.icon ?? '').join(' '),
  );
  await expectError(
    'emoji inválido rechazado',
    () => A.categories.create({ name: 'Mala', icon: 'abc' }),
    'Elige un solo emoji',
  );
  await expectError(
    'dos emojis rechazados',
    () => A.categories.create({ name: 'Dos', icon: '😀😀' }),
    'Elige un solo emoji',
  );
  check('lista de categorías = 10', (await A.categories.list()).length === 10);

  // 5. Movimientos
  const compras = cat('Compras')!;
  const alimentacion = cat('Alimentación')!;
  const transporte = cat('Transporte')!;
  const salario = await A.transactions.create({
    type: 'income',
    amount: 718_000,
    title: 'Salario',
    accountId: bcr.id,
    categoryId: null,
  });
  const super_ = await A.transactions.create({
    type: 'expense',
    amount: 18_000,
    title: 'Supermercado',
    accountId: bcr.id,
    categoryId: compras.id,
  });
  const cafe = await A.transactions.create({
    type: 'expense',
    amount: 750,
    title: 'Café',
    accountId: cash.id,
    categoryId: alimentacion.id,
  });
  const gas = await A.transactions.create({
    type: 'expense',
    amount: 26_100,
    title: 'Combustible',
    accountId: bcr.id,
    categoryId: transporte.id,
  });
  check(
    'create devuelve etiqueta e ícono (ingreso 💰 "Ingreso"; gasto con emoji de su categoría)',
    salario.icon === '💰' &&
      salario.categoryLabel === 'Ingreso' &&
      super_.icon === '🛒' &&
      super_.categoryLabel === 'Compras' &&
      cafe.icon === '☕' &&
      gas.icon === '🚗',
  );

  // 6. Saldos
  const expectedBcr = 20_000 + 718_000 - 18_000 - 26_100; // 693.900
  const expectedCash = 5_000 - 750; // 4.250
  const after = await A.accounts.list();
  check(
    `saldo BCR = ${money(expectedBcr)}`,
    after.find((a) => a.id === bcr.id)?.balance === expectedBcr,
    `${after.find((a) => a.id === bcr.id)?.balance}`,
  );
  check(
    `saldo Efectivo = ${money(expectedCash)}`,
    after.find((a) => a.id === cash.id)?.balance === expectedCash,
    `${after.find((a) => a.id === cash.id)?.balance}`,
  );
  check(
    `getTotalBalance = ${money(expectedBcr + expectedCash)}`,
    (await A.accounts.getTotalBalance()) === expectedBcr + expectedCash,
  );

  // 7. list con filtros
  const all = await A.transactions.list();
  check(
    'list: 4 movimientos, el más reciente primero',
    all.length === 4 && all[0]?.title === 'Combustible' && all[3]?.title === 'Salario',
    all.map((t) => t.title).join(' > '),
  );
  check('filtro type=expense → 3', (await A.transactions.list({ type: 'expense' })).length === 3);
  check('filtro type=income → 1', (await A.transactions.list({ type: 'income' })).length === 1);
  check(
    'búsqueda "super" → Supermercado',
    (await A.transactions.list({ search: 'super' })).map((t) => t.title).join() === 'Supermercado',
  );
  check(
    'búsqueda "CAFE" (sin acento, mayúsculas) → Café',
    (await A.transactions.list({ search: 'CAFE' })).map((t) => t.title).join() === 'Café',
  );
  check(
    'búsqueda por categoría "transporte" → Combustible',
    (await A.transactions.list({ search: 'transporte' })).map((t) => t.title).join() ===
      'Combustible',
  );
  check('limit=2 → 2', (await A.transactions.list({ limit: 2 })).length === 2);
  check(
    'búsqueda sin resultados → 0',
    (await A.transactions.list({ search: 'zzzz' })).length === 0,
  );

  // 8. Totales y serie de la semana (lunes–domingo, hora del dispositivo)
  const { error: oldErr } = await A.client.from('transactions').insert({
    type: 'expense',
    amount: 999,
    title: 'Semana pasada',
    account_id: bcr.id,
    occurred_at: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
  });
  check(
    'movimiento de hace 8 días insertado (debe quedar fuera de la semana)',
    !oldErr,
    oldErr?.message ?? '',
  );
  const expenseTotal = 18_000 + 750 + 26_100;
  check(
    `getPeriodTotal('expense') = ${money(expenseTotal)}`,
    (await A.transactions.getPeriodTotal('expense')) === expenseTotal,
    `${await A.transactions.getPeriodTotal('expense')}`,
  );
  check(
    `getPeriodTotal('income') = ${money(718_000)}`,
    (await A.transactions.getPeriodTotal('income')) === 718_000,
  );
  const series = await A.transactions.getWeeklySeries('expense');
  const sum = series.reduce((t, p) => t + p.value, 0);
  check(
    'serie: 7 puntos Lun…Dom',
    series.map((p) => p.label).join(' ') === 'Lun Mar Mié Jue Vie Sáb Dom',
    series.map((p) => p.label).join(' '),
  );
  check(
    'suma de la serie = getPeriodTotal',
    sum === (await A.transactions.getPeriodTotal('expense')),
    `${sum}`,
  );
  check(
    'todo cae en el día de hoy de la serie',
    series[weekdayIndex(new Date())]?.value === expenseTotal,
    `${series.map((p) => p.value).join(',')}`,
  );

  // 9. Validaciones y datos ajenos
  await expectError(
    'monto 0 rechazado',
    () =>
      A.transactions.create({
        type: 'expense',
        amount: 0,
        title: 'x',
        accountId: bcr.id,
        categoryId: null,
      }),
    'El monto debe ser un entero mayor que 0',
  );
  await expectError(
    'monto negativo rechazado',
    () =>
      A.transactions.create({
        type: 'expense',
        amount: -5,
        title: 'x',
        accountId: bcr.id,
        categoryId: null,
      }),
    'El monto debe ser un entero mayor que 0',
  );
  await expectError(
    'monto con decimales rechazado',
    () =>
      A.transactions.create({
        type: 'expense',
        amount: 1.5,
        title: 'x',
        accountId: bcr.id,
        categoryId: null,
      }),
    'El monto debe ser un entero mayor que 0',
  );
  await expectError(
    'cuenta con monto inicial negativo rechazada',
    () => A.accounts.create({ name: 'Mala', icon: '💵', initialAmount: -1 }),
    'El monto inicial debe ser un entero de 0 o más',
  );
  await expectError(
    'cuenta sin nombre rechazada',
    () => A.accounts.create({ name: '  ', icon: '💵', initialAmount: 0 }),
    'Ingresa un nombre',
  );

  // 10. Usuario B: aislamiento total
  await B.auth.signUp({ name: 'Usuario B', email: `qa-data-b-${stamp}@pigxel-test.dev`, password });
  const bAcc = await B.accounts.create({ name: 'Cuenta B', icon: '💳', initialAmount: 1_000 });
  check(
    'B no ve cuentas de A (solo la suya)',
    (await B.accounts.list()).map((a) => a.name).join() === 'Cuenta B',
  );
  check(
    'B tiene sus propias 8 categorías (no ve "Juegos" de A)',
    (await B.categories.list()).length === 8,
  );
  check('B no ve movimientos de A', (await B.transactions.list()).length === 0);
  check(
    'B: totales en 0',
    (await B.transactions.getPeriodTotal('expense')) === 0 &&
      (await B.accounts.getTotalBalance()) === 1_000,
  );
  await expectError(
    'B no puede registrar en la cuenta de A',
    () =>
      B.transactions.create({
        type: 'expense',
        amount: 100,
        title: 'intruso',
        accountId: bcr.id,
        categoryId: null,
      }),
    'La cuenta o la categoría no es válida',
  );
  await expectError(
    'B no puede usar una categoría de A',
    () =>
      B.transactions.create({
        type: 'expense',
        amount: 100,
        title: 'intruso',
        accountId: bAcc.id,
        categoryId: juegos.id,
      }),
    'La cuenta o la categoría no es válida',
  );
  const bJuegos = await B.categories.create({ name: 'Juegos', icon: '🎮' });
  check('B puede crear su propia "Juegos" (único por usuario)', bJuegos.name === 'Juegos');
  check(
    'A no se vio afectado (sigue con 4+1 movimientos y saldo total)',
    (await A.transactions.list({ limit: 50 })).length === 5,
  );

  await A.auth.signOut();
  await B.auth.signOut();
  console.log(
    `\n${failures === 0 ? '🎉 Todo OK' : `⚠️ ${failures} fallo(s)`} · usuarios de prueba: qa-data-${stamp}@…, qa-data-b-${stamp}@… (@pigxel-test.dev)`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('💥 Error inesperado:', e);
  process.exit(1);
});
