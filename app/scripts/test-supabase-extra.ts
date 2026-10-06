/// <reference types="node" />
/**
 * Prueba de integración REAL (etapa 3): suscripciones, objetivos, gasto del periodo, resumen de
 * inicio, seed de demo, RLS y flujo completo de Consultar con datos reales.
 * Uso: npm run test:supabase-extra
 * Los usuarios de prueba quedan en Auth (no hay service_role): purgar desde el panel.
 */
import { createClient } from '@supabase/supabase-js';

import type { Database } from '../src/data/supabase/database.types';
import { createRepositoriesFromClient } from '../src/data/supabase/factory';
import { getHomeSummary } from '../src/features/accounts/homeSummary';
import { computeConsult } from '../src/features/consult/calc';
import { getConsultContext } from '../src/features/consult/context';
import { addPlanPeriod, toLocalDateString } from '../src/lib/planPeriod';
import { seedDemo } from './lib/seed-demo';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta ${name} en .env`);
  return value;
}
const url = requireEnv('EXPO_PUBLIC_SUPABASE_URL');
const key = requireEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');

function user() {
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return { client, repos: createRepositoriesFromClient(client) };
}

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
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const ymd = (iso: string) => toLocalDateString(new Date(iso));

async function main() {
  const stamp = Date.now();
  const password = 'Pigxel-Test-1234';
  const mail = (tag: string) => `qa-extra-${tag}-${stamp}@pigxel-test.dev`;

  // ───────────── Usuario A: suscripciones, objetivos, periodo, inicio y Consultar ─────────────
  const A = user();
  await A.repos.auth.signUp({ name: 'Usuario Extra', email: mail('a'), password });
  check('signUp usuario A', (await A.repos.auth.getSession()) !== null);

  // Suscripciones
  const sub = A.repos.subscriptions;
  const spotify = await sub.create({
    name: 'Spotify',
    icon: '💳',
    cost: 1_000,
    status: 'active',
    plan: 'monthly',
  });
  const netflix = await sub.create({
    name: 'Netflix',
    icon: '🎬',
    cost: 700,
    status: 'active',
    plan: 'weekly',
  });
  const icloud = await sub.create({
    name: 'iCloud+',
    icon: '☁️',
    cost: 12_000,
    status: 'active',
    plan: 'yearly',
  });
  await sub.create({
    name: 'Inactiva',
    icon: '💤',
    cost: 9_999,
    status: 'inactive',
    plan: 'monthly',
  });
  check(
    'suscripción conserva emoji y plan',
    spotify.icon === '💳' && icloud.icon === '☁️' && netflix.plan === 'weekly',
  );

  const today = new Date();
  const weeklyExpected = toLocalDateString(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
  );
  check(
    'next_charge_at semanal = hoy + 7 días',
    ymd(netflix.nextChargeAt) === weeklyExpected,
    `${ymd(netflix.nextChargeAt)} (esperado ${weeklyExpected})`,
  );
  check(
    'next_charge_at mensual y anual = addPlanPeriod(hoy)',
    ymd(spotify.nextChargeAt) === toLocalDateString(addPlanPeriod(today, 'monthly')) &&
      ymd(icloud.nextChargeAt) === toLocalDateString(addPlanPeriod(today, 'yearly')),
    `${ymd(spotify.nextChargeAt)} / ${ymd(icloud.nextChargeAt)}`,
  );
  const listed = await sub.list();
  check(
    'orden por próximo cobro y luego nombre',
    listed.map((s) => s.name).join(', ') === 'Netflix, Inactiva, Spotify, iCloud+',
    listed.map((s) => s.name).join(', '),
  );
  const monthly = await sub.getMonthlyCost();
  // 1.000 + 700×52/12 (3.033,3) + 12.000/12 (1.000) = 5.033,3 → 5.033; la inactiva no cuenta.
  check(
    'getMonthlyCost normaliza a mensual y excluye inactivas = ¢5.033',
    monthly === 5_033,
    `${monthly}`,
  );
  await expectError(
    'costo 0 rechazado',
    () => sub.create({ name: 'X', icon: '💳', cost: 0, status: 'active', plan: 'monthly' }),
    'El costo debe ser un entero mayor que 0',
  );
  await expectError(
    'costo con decimales rechazado',
    () => sub.create({ name: 'X', icon: '💳', cost: 10.5, status: 'active', plan: 'monthly' }),
    'El costo debe ser un entero mayor que 0',
  );
  await expectError(
    'nombre vacío rechazado',
    () => sub.create({ name: ' ', icon: '💳', cost: 10, status: 'active', plan: 'monthly' }),
    'Ingresa un nombre',
  );
  await expectError(
    'emoji inválido rechazado',
    () => sub.create({ name: 'X', icon: 'abc', cost: 10, status: 'active', plan: 'monthly' }),
    'Elige un solo emoji',
  );
  await expectError(
    'plan inválido rechazado',
    () => sub.create({ name: 'X', icon: '💳', cost: 10, status: 'active', plan: 'daily' as never }),
    'Elige un plan válido',
  );

  // Objetivos
  const goals = A.repos.goals;
  const viaje = await goals.create({
    name: 'Viaje a la playa',
    icon: '📌',
    targetAmount: 100_000,
    initialAmount: 20_000,
  });
  const laptop = await goals.create({
    name: 'Laptop',
    icon: '📌',
    targetAmount: 600_000,
    initialAmount: 350_000,
  });
  const completo = await goals.create({
    name: 'Completo',
    icon: '🏆',
    targetAmount: 5_000,
    initialAmount: 5_000,
  });
  check('progreso 20.000/100.000 = 20 %', viaje.progressPercent === 20, `${viaje.progressPercent}`);
  check(
    'progreso 350.000/600.000 = 58 %',
    laptop.progressPercent === 58,
    `${laptop.progressPercent}`,
  );
  check('progreso completo = 100 % (tope)', completo.progressPercent === 100);
  const goalList = await goals.list();
  check(
    'goals.list en orden de creación con progreso y emoji',
    goalList.map((g) => g.name).join() === 'Viaje a la playa,Laptop,Completo' &&
      goalList[0]?.progressPercent === 20 &&
      goalList[0]?.icon === '📌',
  );
  await expectError(
    'objetivo 0 rechazado',
    () => goals.create({ name: 'X', icon: '📌', targetAmount: 0, initialAmount: 0 }),
    'El monto objetivo debe ser un entero mayor que 0',
  );
  await expectError(
    'monto inicial negativo rechazado',
    () => goals.create({ name: 'X', icon: '📌', targetAmount: 100, initialAmount: -1 }),
    'El monto inicial debe ser un entero de 0 o más',
  );
  await expectError(
    'monto inicial mayor que la meta rechazado',
    () => goals.create({ name: 'X', icon: '📌', targetAmount: 100, initialAmount: 101 }),
    'El monto inicial no puede superar el objetivo',
  );
  await expectError(
    'objetivo sin nombre rechazado',
    () => goals.create({ name: '', icon: '📌', targetAmount: 100, initialAmount: 0 }),
    'Ingresa un nombre',
  );

  // Gasto del periodo
  const acc = await A.repos.accounts.create({
    name: 'Cuenta A',
    icon: '🏦',
    initialAmount: 100_000,
  });
  const compras = (await A.repos.categories.list()).find((c) => c.name === 'Compras')!;
  const tx = A.repos.transactions;
  await tx.create({
    type: 'expense',
    amount: 18_000,
    title: 'Super',
    accountId: acc.id,
    categoryId: compras.id,
  });
  await tx.create({
    type: 'expense',
    amount: 750,
    title: 'Café',
    accountId: acc.id,
    categoryId: null,
  });
  await tx.create({
    type: 'income',
    amount: 5_000,
    title: 'Ingreso extra',
    accountId: acc.id,
    categoryId: null,
  });
  const eightDaysAgo = new Date(Date.now() - 8 * 24 * 3600 * 1000);
  const { error: oldErr } = await A.client.from('transactions').insert({
    type: 'expense',
    amount: 999,
    title: 'Hace 8 días',
    account_id: acc.id,
    occurred_at: eightDaysAgo.toISOString(),
  });
  check('gasto de hace 8 días insertado', !oldErr, oldErr?.message ?? '');
  const weekly = await tx.getSpentInPeriod('weekly');
  const monthlySpent = await tx.getSpentInPeriod('monthly');
  const sameMonth =
    eightDaysAgo.getMonth() === today.getMonth() &&
    eightDaysAgo.getFullYear() === today.getFullYear();
  const expectedMonthly = 18_750 + (sameMonth ? 999 : 0);
  check(
    'getSpentInPeriod("weekly") = ¢18.750 (sin ingresos ni la semana pasada)',
    weekly === 18_750,
    `${weekly}`,
  );
  check(
    `getSpentInPeriod("monthly") = ¢${expectedMonthly} (mes calendario)`,
    monthlySpent === expectedMonthly,
    `${monthlySpent}`,
  );

  // Resumen de inicio
  const summary = await getHomeSummary(A.repos);
  const expectedBalance = 100_000 - 18_000 - 750 - 999 + 5_000; // 85.251
  check(
    `getHomeSummary: saldo total = ¢${expectedBalance}`,
    summary.totalBalance === expectedBalance,
    `${summary.totalBalance}`,
  );
  check(
    'getHomeSummary: 1 cuenta, 4 suscripciones, 3 objetivos',
    summary.accounts.length === 1 &&
      summary.subscriptions.length === 4 &&
      summary.goals.length === 3,
  );
  check(
    'getHomeSummary: 3 recientes, el más viejo (hace 8 días) queda fuera',
    summary.recent.length === 3 && !summary.recent.some((t) => t.title === 'Hace 8 días'),
    summary.recent.map((t) => t.title).join(', '),
  );

  // Consultar con datos reales (límite ¢50.000 mensual)
  await A.repos.settings.updateSettings({
    spendingLimit: { enabled: true, amount: 50_000, period: 'monthly' },
  });
  const ctx = await getConsultContext(A.repos);
  check(
    'getConsultContext: saldo real, límite y gasto del periodo',
    ctx.balance === expectedBalance &&
      ctx.limit.amount === 50_000 &&
      ctx.spentInPeriod === expectedMonthly,
    JSON.stringify(ctx),
  );
  const ask = (amount: number) =>
    computeConsult({
      balance: ctx.balance,
      amount,
      limit: ctx.limit,
      spentInPeriod: ctx.spentInPeriod,
    });
  const c1 = ask(30_000);
  check(
    `Consultar ¢30.000 → quedan ¢${expectedBalance - 30_000}`,
    c1.remaining === expectedBalance - 30_000 && c1.canAfford,
    JSON.stringify(c1),
  );
  check(
    'límite cerca (> 80 %) con ¢30.000',
    c1.limitStatus === 'near',
    `${c1.limitStatus}, quedarían ${c1.remainingAfterLimit} del límite`,
  );
  check(
    'límite superado con ¢40.000 (informa, no bloquea)',
    ask(40_000).limitStatus === 'exceeded' && ask(40_000).canAfford,
  );
  check('límite ok con ¢5.000', ask(5_000).limitStatus === 'ok');
  check(
    'monto = saldo → quedan 0 y se puede',
    ask(expectedBalance).remaining === 0 && ask(expectedBalance).canAfford,
  );
  check(
    'monto > saldo → negativo y no alcanza',
    ask(expectedBalance + 1).remaining === -1 && !ask(expectedBalance + 1).canAfford,
  );
  await A.repos.settings.updateSettings({
    spendingLimit: { enabled: false, amount: 50_000, period: 'monthly' },
  });
  const off = await getConsultContext(A.repos);
  check(
    'límite apagado → "off"',
    computeConsult({
      balance: off.balance,
      amount: 99_999,
      limit: off.limit,
      spentInPeriod: off.spentInPeriod,
    }).limitStatus === 'off',
  );
  await A.repos.auth.signOut();

  // ───────────── Usuario B: seed de demo ─────────────
  const B = user();
  await B.repos.auth.signUp({ name: 'Usuario Seed', email: mail('b'), password });
  const first = await seedDemo({ client: B.client, repos: B.repos });
  check(
    'seed: cargó la demo',
    first.status === 'seeded' &&
      first.counts.accounts === 2 &&
      first.counts.transactions === 4 &&
      first.counts.subscriptions === 2 &&
      first.counts.goals === 2,
    JSON.stringify(first.counts),
  );

  const bAccounts = await B.repos.accounts.list();
  const bcr = bAccounts.find((a) => a.name === 'BCR');
  const efectivo = bAccounts.find((a) => a.name === 'Efectivo');
  check(
    'cuentas con emoji y descripción del diseño',
    bcr?.icon === '🏛️' &&
      bcr.description === 'Banco de Costa Rica' &&
      efectivo?.icon === '💵' &&
      efectivo.description === 'Billetera en efectivo',
  );
  // Saldos: BCR 20.000 + 718.000 − 18.000 − 26.100 = 693.900 · Efectivo 5.000 − 750 = 4.250
  check(
    'saldo BCR = ¢693.900 y Efectivo = ¢4.250',
    bcr?.balance === 693_900 && efectivo?.balance === 4_250,
    `${bcr?.balance} / ${efectivo?.balance}`,
  );
  const bTotal = await B.repos.accounts.getTotalBalance();
  check(
    'saldo total mostrado por las cuentas = ¢698.150 (el diseño dice ¢830.000: dato de ejemplo)',
    bTotal === 698_150,
    `${bTotal}`,
  );
  check('categorías por defecto = 8', (await B.repos.categories.list()).length === 8);

  const bTx = await B.repos.transactions.list();
  const find = (t: string) => bTx.find((x) => x.title === t);
  check(
    'movimientos con emoji de su categoría (🛒 ☕ 💰 🚗)',
    find('Supermercado')?.icon === '🛒' &&
      find('Café')?.icon === '☕' &&
      find('Salario')?.icon === '💰' &&
      find('Combustible')?.icon === '🚗',
  );
  check(
    'rótulos: Compras, Alimentación, Ingreso, Transporte',
    find('Supermercado')?.categoryLabel === 'Compras' &&
      find('Café')?.categoryLabel === 'Alimentación' &&
      find('Salario')?.categoryLabel === 'Ingreso' &&
      find('Combustible')?.categoryLabel === 'Transporte',
  );
  const todayStr = toLocalDateString(new Date());
  const yesterdayStr = toLocalDateString(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
  );
  check(
    'fechas: Supermercado hoy; Café, Salario y Combustible ayer',
    ymd(find('Supermercado')!.occurredAt) === todayStr &&
      ['Café', 'Salario', 'Combustible'].every((t) => ymd(find(t)!.occurredAt) === yesterdayStr),
  );
  check(
    'montos: 18.000 / 750 / 718.000 / 26.100',
    find('Supermercado')?.amount === 18_000 &&
      find('Café')?.amount === 750 &&
      find('Salario')?.amount === 718_000 &&
      find('Combustible')?.amount === 26_100,
  );

  const bSubs = await B.repos.subscriptions.list();
  check(
    'suscripciones 💳 Spotify ¢1.000 y Claude Pro ¢4.500 (mensual)',
    bSubs.length === 2 &&
      bSubs.some(
        (s) => s.name === 'Spotify' && s.cost === 1_000 && s.icon === '💳' && s.plan === 'monthly',
      ) &&
      bSubs.some((s) => s.name === 'Claude Pro' && s.cost === 4_500),
  );
  check('costo mensual = ¢5.500', (await B.repos.subscriptions.getMonthlyCost()) === 5_500);
  const bGoals = await B.repos.goals.list();
  check(
    'objetivos 📌 20.000/100.000 (20 %) y 350.000/600.000 (58 %)',
    bGoals.length === 2 &&
      bGoals[0]?.name === 'Viaje a la playa' &&
      bGoals[0].progressPercent === 20 &&
      bGoals[1]?.name === 'Laptop' &&
      bGoals[1].progressPercent === 58 &&
      bGoals.every((g) => g.icon === '📌'),
  );
  const bSettings = await B.repos.settings.getSettings();
  check(
    'límite ¢300.000 mensual activo',
    bSettings.spendingLimit.enabled &&
      bSettings.spendingLimit.amount === 300_000 &&
      bSettings.spendingLimit.period === 'monthly',
  );
  const bSummary = await getHomeSummary(B.repos);
  check(
    'getHomeSummary del seed: total ¢698.150, 3 recientes, 2 cuentas',
    bSummary.totalBalance === 698_150 &&
      bSummary.recent.length === 3 &&
      bSummary.accounts.length === 2,
  );
  const bConsult = computeConsult({
    balance: bTotal,
    amount: 700_000,
    limit: bSettings.spendingLimit,
    spentInPeriod: await B.repos.transactions.getSpentInPeriod('monthly'),
  });
  check(
    'Consultar ¢700.000 con el saldo real → quedan ¢-1.850 (no alcanza)',
    bConsult.remaining === -1_850 && !bConsult.canAfford,
    JSON.stringify(bConsult),
  );

  // Idempotencia y --reset
  const before = JSON.stringify(first.counts);
  const second = await seedDemo({ client: B.client, repos: B.repos });
  check(
    'seed repetido: avisa y no duplica',
    second.status === 'skipped' && JSON.stringify(second.counts) === before,
    second.message,
  );
  const profileBefore = await B.repos.settings.getProfile();
  const reseeded = await seedDemo({ client: B.client, repos: B.repos, reset: true });
  check(
    'seed --reset: borra y recarga sin duplicar',
    reseeded.status === 'seeded' && JSON.stringify(reseeded.counts) === before,
    JSON.stringify(reseeded.counts),
  );
  const profileAfter = await B.repos.settings.getProfile();
  check(
    '--reset no borra usuario, perfil ni categorías',
    same(profileBefore, profileAfter) &&
      (await B.repos.categories.list()).length === 8 &&
      (await B.repos.auth.getSession()) !== null,
  );
  check(
    'saldo total tras --reset = ¢698.150',
    (await B.repos.accounts.getTotalBalance()) === 698_150,
  );

  // ───────────── Usuario C: RLS ─────────────
  const C = user();
  await C.repos.auth.signUp({ name: 'Usuario C', email: mail('c'), password });
  const cSummary = await getHomeSummary(C.repos);
  check(
    'C (usuario vacío) no ve datos de A ni B',
    cSummary.accounts.length === 0 &&
      cSummary.recent.length === 0 &&
      cSummary.subscriptions.length === 0 &&
      cSummary.goals.length === 0 &&
      cSummary.totalBalance === 0,
  );
  check(
    'C: costo mensual y gasto del periodo en 0',
    (await C.repos.subscriptions.getMonthlyCost()) === 0 &&
      (await C.repos.transactions.getSpentInPeriod('monthly')) === 0,
  );
  const { data: leakGoals } = await C.client.from('goals').select('*').eq('id', bGoals[0]!.id);
  const { data: leakSubs } = await C.client
    .from('subscriptions')
    .select('*')
    .eq('id', bSubs[0]!.id);
  check(
    'C no puede leer un objetivo ni una suscripción de B por id',
    (leakGoals?.length ?? 1) === 0 && (leakSubs?.length ?? 1) === 0,
  );
  const { data: edited } = await C.client
    .from('goals')
    .update({ name: 'hack' })
    .eq('id', bGoals[0]!.id)
    .select();
  check('C no puede editar un objetivo de B', (edited?.length ?? 1) === 0);
  const { error: leakInsert } = await C.client
    .from('subscriptions')
    .insert({ name: 'intruso', user_id: (await B.repos.auth.getSession())!.userId });
  check(
    'C no puede insertar una suscripción a nombre de B',
    !!leakInsert,
    leakInsert?.code ?? 'sin error',
  );

  await B.repos.auth.signOut();
  await C.repos.auth.signOut();
  console.log(
    `\n${failures === 0 ? '🎉 Todo OK' : `⚠️ ${failures} fallo(s)`} · usuarios de prueba: qa-extra-{a,b,c}-${stamp}@pigxel-test.dev`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('💥 Error inesperado:', e);
  process.exit(1);
});
