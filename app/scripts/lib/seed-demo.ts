/**
 * Datos de demostración de los diseños de Figma. Idempotente: si el usuario ya tiene datos
 * financieros no duplica nada (avisa y termina), salvo con `reset`, que borra SOLO los datos
 * financieros de ese usuario (movimientos, cuentas, suscripciones y objetivos), nunca el usuario,
 * su perfil, sus ajustes ni sus categorías.
 */
import type { Repositories } from '../../src/data/repositories';
import type { PigxelClient } from '../../src/data/supabase/types';

export interface SeedCounts {
  accounts: number;
  transactions: number;
  subscriptions: number;
  goals: number;
}

export interface SeedResult {
  status: 'seeded' | 'skipped';
  message: string;
  counts: SeedCounts;
}

/** Fecha local relativa a hoy: `at(0, 8, 24)` = hoy 8:24, `at(1, 16, 24)` = ayer 4:24 PM. */
const at = (daysAgo: number, hour: number, minute: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

async function countData(repos: Repositories): Promise<SeedCounts> {
  const [accounts, transactions, subscriptions, goals] = await Promise.all([
    repos.accounts.list(),
    repos.transactions.list(),
    repos.subscriptions.list(),
    repos.goals.list(),
  ]);
  return {
    accounts: accounts.length,
    transactions: transactions.length,
    subscriptions: subscriptions.length,
    goals: goals.length,
  };
}

async function wipeFinancialData(client: PigxelClient): Promise<void> {
  // Orden: movimientos antes que cuentas (también caerían en cascada). RLS limita al usuario.
  for (const table of ['transactions', 'subscriptions', 'goals', 'accounts'] as const) {
    const { error } = await client.from(table).delete().not('id', 'is', null);
    if (error) throw new Error(`No se pudo borrar ${table}: ${error.message}`);
  }
}

export async function seedDemo(options: {
  client: PigxelClient;
  repos: Repositories;
  reset?: boolean;
}): Promise<SeedResult> {
  const { client, repos, reset = false } = options;

  const before = await countData(repos);
  const hasData = Object.values(before).some((n) => n > 0);
  if (hasData && !reset) {
    return {
      status: 'skipped',
      message:
        'El usuario ya tiene datos financieros: no se duplicó nada. Usa --reset para borrarlos y volver a cargar la demo.',
      counts: before,
    };
  }
  if (hasData) await wipeFinancialData(client);

  // Cuentas (descripción solo en estas dos, como en el diseño).
  const bcr = await repos.accounts.create({
    name: 'BCR',
    icon: '🏛️',
    initialAmount: 20_000,
    description: 'Banco de Costa Rica',
  });
  const cash = await repos.accounts.create({
    name: 'Efectivo',
    icon: '💵',
    initialAmount: 5_000,
    description: 'Billetera en efectivo',
  });

  // Categorías por defecto (las crea el trigger al registrarse); se completan si faltan.
  let categories = await repos.categories.list();
  const ensureCategory = async (name: string, icon: string) => {
    const found = categories.find((c) => c.name === name);
    if (found) return found.id;
    const created = await repos.categories.create({ name, icon });
    categories = [...categories, created];
    return created.id;
  };
  const compras = await ensureCategory('Compras', '🛒');
  const alimentacion = await ensureCategory('Alimentación', '☕');
  const transporte = await ensureCategory('Transporte', '🚗');

  // Movimientos con fechas de hoy y ayer (la API de la app no acepta fecha: se inserta directo).
  const rows = [
    {
      type: 'expense',
      title: 'Supermercado',
      amount: 18_000,
      account_id: bcr.id,
      category_id: compras,
      occurred_at: at(0, 8, 24),
    },
    {
      type: 'expense',
      title: 'Café',
      amount: 750,
      account_id: cash.id,
      category_id: alimentacion,
      occurred_at: at(1, 16, 24),
    },
    {
      type: 'income',
      title: 'Salario',
      amount: 718_000,
      account_id: bcr.id,
      category_id: null,
      occurred_at: at(1, 13, 10),
    },
    {
      type: 'expense',
      title: 'Combustible',
      amount: 26_100,
      account_id: bcr.id,
      category_id: transporte,
      occurred_at: at(1, 6, 38),
    },
  ];
  const { error: txError } = await client.from('transactions').insert(rows);
  if (txError) throw new Error(`No se pudieron crear los movimientos: ${txError.message}`);

  // Suscripciones y objetivos.
  for (const sub of [
    { name: 'Spotify', cost: 1_000 },
    { name: 'Claude Pro', cost: 4_500 },
  ]) {
    await repos.subscriptions.create({ ...sub, icon: '💳', status: 'active', plan: 'monthly' });
  }
  await repos.goals.create({
    name: 'Viaje a la playa',
    icon: '📌',
    targetAmount: 100_000,
    initialAmount: 20_000,
  });
  await repos.goals.create({
    name: 'Laptop',
    icon: '📌',
    targetAmount: 600_000,
    initialAmount: 350_000,
  });

  // Límite de gastos ¢300.000 mensual.
  const settings = await repos.settings.getSettings();
  await repos.settings.updateSettings({
    spendingLimit: { ...settings.spendingLimit, enabled: true, amount: 300_000, period: 'monthly' },
  });

  const counts = await countData(repos);
  return {
    status: 'seeded',
    message: reset ? 'Datos anteriores borrados y demo cargada.' : 'Demo cargada.',
    counts,
  };
}
