import { percent } from '../../lib/utils';
import type {
  Account,
  Category,
  Goal,
  Subscription,
  Transaction,
  UserProfile,
  UserSettings,
} from '../models';

/** Fecha relativa a hoy: `at(0, 8, 24)` = hoy 8:24, `at(1, 16, 24)` = ayer 4:24 PM. */
export const at = (daysAgo: number, hour: number, minute: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const inDays = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
};

/**
 * Datos tomados de los diseños de Figma. OJO: el diseño muestra un saldo total de ¢830.000
 * que NO coincide con la suma de las cuentas (¢20.000 + ¢5.000). Se conserva por fidelidad
 * visual; se corregirá cuando haya datos reales (ver MOCK_TOTAL_BALANCE).
 */
export const MOCK_TOTAL_BALANCE = 830_000;
export const MOCK_PERIOD_EXPENSES = 128_500;
export const MOCK_PERIOD_INCOME = 718_000;

export const accounts: Account[] = [
  {
    id: 'acc-bcr',
    name: 'BCR',
    description: 'Banco de Costa Rica',
    icon: '🏛️',
    initialAmount: 20_000,
    balance: 20_000,
  },
  {
    id: 'acc-cash',
    name: 'Efectivo',
    description: 'Billetera en efectivo',
    icon: '💵',
    initialAmount: 5_000,
    balance: 5_000,
  },
];

export const categories: Category[] = [
  { id: 'cat-food', name: 'Alimentación', icon: '☕' },
  { id: 'cat-transport', name: 'Transporte', icon: '🚗' },
  { id: 'cat-fun', name: 'Entretenimiento', icon: '🎬' },
  { id: 'cat-shopping', name: 'Compras', icon: '🛒' },
  { id: 'cat-health', name: 'Salud', icon: '🩺' },
  { id: 'cat-education', name: 'Educación', icon: '🎓' },
  { id: 'cat-home', name: 'Hogar', icon: '🏠' },
  { id: 'cat-other', name: 'Otros', icon: '📦' },
];

export const transactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'expense',
    title: 'Supermercado',
    amount: 18_000,
    accountId: 'acc-bcr',
    categoryId: 'cat-shopping',
    categoryLabel: 'Compras',
    icon: '🛒',
    occurredAt: at(0, 8, 24),
  },
  {
    id: 'tx-2',
    type: 'expense',
    title: 'Café',
    amount: 750,
    accountId: 'acc-cash',
    categoryId: 'cat-food',
    categoryLabel: 'Alimentación',
    icon: '☕',
    occurredAt: at(1, 16, 24),
  },
  {
    id: 'tx-3',
    type: 'income',
    title: 'Salario',
    amount: 718_000,
    accountId: 'acc-bcr',
    categoryId: null,
    categoryLabel: 'Ingreso',
    icon: '💰',
    occurredAt: at(1, 13, 10),
  },
  {
    id: 'tx-4',
    type: 'expense',
    title: 'Combustible',
    amount: 26_100,
    accountId: 'acc-bcr',
    categoryId: 'cat-transport',
    categoryLabel: 'Transporte',
    icon: '🚗',
    occurredAt: at(1, 6, 38),
  },
];

export const subscriptions: Subscription[] = [
  {
    id: 'sub-netflix',
    name: 'Netflix',
    icon: '🎬',
    cost: 5_000,
    status: 'active',
    plan: 'monthly',
    nextChargeAt: inDays(5),
  },
  {
    id: 'sub-spotify',
    name: 'Spotify',
    icon: '💳',
    cost: 1_000,
    status: 'active',
    plan: 'monthly',
    nextChargeAt: inDays(9),
  },
  {
    id: 'sub-icloud',
    name: 'iCloud+',
    icon: '💳',
    cost: 500,
    status: 'active',
    plan: 'monthly',
    nextChargeAt: inDays(12),
  },
  {
    id: 'sub-youtube',
    name: 'YouTube Premium',
    icon: '💳',
    cost: 3_000,
    status: 'active',
    plan: 'monthly',
    nextChargeAt: inDays(14),
  },
  {
    id: 'sub-claude',
    name: 'Claude Pro',
    icon: '💳',
    cost: 4_500,
    status: 'active',
    plan: 'monthly',
    nextChargeAt: inDays(16),
  },
];

const goal = (id: string, name: string, targetAmount: number, currentAmount: number): Goal => ({
  id,
  name,
  icon: '📌',
  targetAmount,
  currentAmount,
  progressPercent: percent(currentAmount, targetAmount),
});

export const goals: Goal[] = [
  goal('goal-beach', 'Viaje a la playa', 100_000, 20_000),
  goal('goal-laptop', 'Laptop', 600_000, 350_000),
];

export const profile: UserProfile = {
  id: 'user-mock',
  fullName: 'Kevin Josué Miranda Miranda',
  username: 'kevinmiranda',
  email: 'kevinmiranda@gmail.com',
  phone: '+506 8888 8888',
};

export const settings: UserSettings = {
  currency: 'CRC',
  language: 'es',
  appearance: 'system',
  spendingLimit: { enabled: true, amount: 300_000, period: 'monthly' },
  notifications: {
    subscriptions: true,
    goals: true,
    limit: true,
    activity: false,
    news: true,
    email: true,
  },
};

/** Serie semanal de ejemplo (Lun–Dom) para la gráfica de Actividad; Vie = ¢18.500. */
export const weeklyExpenseSeries = [
  { label: 'Lun', value: 4_000 },
  { label: 'Mar', value: 7_000 },
  { label: 'Mié', value: 9_500 },
  { label: 'Jue', value: 21_000 },
  { label: 'Vie', value: 18_500 },
  { label: 'Sáb', value: 9_000 },
  { label: 'Dom', value: 15_000 },
];
