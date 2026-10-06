/** Mapeos puros fila ↔ modelo. Sin dependencias de React Native. */
import { parseLocalDate } from '../../lib/planPeriod';
import { percent } from '../../lib/utils';
import type {
  Account,
  Appearance,
  Category,
  CurrencyCode,
  Goal,
  LanguageCode,
  LimitPeriod,
  NotificationPrefs,
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
  Transaction,
  TransactionType,
  UserProfile,
  UserSettings,
} from '../models';
import type { Tables, TablesUpdate } from './database.types';

type ProfileRow = Tables<'profiles'>;
type SettingsRow = Tables<'user_settings'>;

export function profileFromRow(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    username: row.username,
    email: row.email,
    phone: row.phone,
  };
}

/** `email` no se escribe en `profiles`: cambia vía Auth (ver SettingsRepository). */
export function profilePatchToRow(
  patch: Partial<Omit<UserProfile, 'id'>>,
): TablesUpdate<'profiles'> {
  const row: TablesUpdate<'profiles'> = {};
  if (patch.fullName !== undefined) row.full_name = patch.fullName;
  if (patch.username !== undefined) row.username = patch.username;
  if (patch.phone !== undefined) row.phone = patch.phone;
  return row;
}

export function settingsFromRow(row: SettingsRow): UserSettings {
  return {
    currency: row.currency as CurrencyCode,
    language: row.language as LanguageCode,
    appearance: row.appearance as Appearance,
    spendingLimit: {
      enabled: row.limit_enabled,
      amount: row.limit_amount,
      period: row.limit_period as LimitPeriod,
    },
    notifications: {
      subscriptions: row.notify_subscriptions,
      goals: row.notify_goals,
      limit: row.notify_limit,
      activity: row.notify_activity,
      news: row.notify_news,
      email: row.notify_email,
    },
  };
}

const NOTIFICATION_COLUMNS: Record<keyof NotificationPrefs, keyof TablesUpdate<'user_settings'>> = {
  subscriptions: 'notify_subscriptions',
  goals: 'notify_goals',
  limit: 'notify_limit',
  activity: 'notify_activity',
  news: 'notify_news',
  email: 'notify_email',
};

/** Acepta parches parciales, también dentro de `spendingLimit` y `notifications`. */
export function settingsPatchToRow(
  patch: Partial<{
    [K in keyof UserSettings]: K extends 'spendingLimit' | 'notifications'
      ? Partial<UserSettings[K]>
      : UserSettings[K];
  }>,
): TablesUpdate<'user_settings'> {
  const row: Record<string, unknown> = {};
  if (patch.currency !== undefined) row.currency = patch.currency;
  if (patch.language !== undefined) row.language = patch.language;
  if (patch.appearance !== undefined) row.appearance = patch.appearance;

  const limit = patch.spendingLimit;
  if (limit) {
    if (limit.enabled !== undefined) row.limit_enabled = limit.enabled;
    if (limit.amount !== undefined) row.limit_amount = limit.amount;
    if (limit.period !== undefined) row.limit_period = limit.period;
  }

  const notifications = patch.notifications;
  if (notifications) {
    for (const key of Object.keys(NOTIFICATION_COLUMNS) as (keyof NotificationPrefs)[]) {
      const value = notifications[key];
      if (value !== undefined) row[NOTIFICATION_COLUMNS[key]] = value;
    }
  }
  return row as TablesUpdate<'user_settings'>;
}

// ───────── Cuentas, categorías y movimientos ─────────
type AccountRow = Tables<'accounts'>;
type CategoryRow = Tables<'categories'>;
type TransactionRow = Tables<'transactions'>;

/** Fila de `transactions` con su categoría embebida (select con `category:categories(...)`). */
export type TransactionWithCategory = TransactionRow & {
  category: Pick<CategoryRow, 'name' | 'icon'> | null;
};

export const DEFAULT_EXPENSE_EMOJI = '💸';
export const DEFAULT_INCOME_EMOJI = '💰';

export function accountFromRow(row: AccountRow, balance: number): Account {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    icon: row.icon,
    initialAmount: row.initial_amount,
    balance,
  };
}

export function categoryFromRow(row: CategoryRow): Category {
  return { id: row.id, name: row.name, icon: row.icon };
}

export function transactionFromRow(row: TransactionWithCategory): Transaction {
  const type = row.type as TransactionType;
  const category = row.category;
  return {
    id: row.id,
    type,
    title: row.title.trim() || category?.name || (type === 'income' ? 'Ingreso' : 'Gasto'),
    amount: row.amount,
    accountId: row.account_id,
    categoryId: row.category_id,
    // Un ingreso sin categoría se rotula "Ingreso" (como en el diseño); un gasto, "Sin categoría".
    categoryLabel: category?.name ?? (type === 'income' ? 'Ingreso' : 'Sin categoría'),
    icon: category?.icon ?? (type === 'income' ? DEFAULT_INCOME_EMOJI : DEFAULT_EXPENSE_EMOJI),
    occurredAt: row.occurred_at,
  };
}

// ───────── Suscripciones y objetivos ─────────
type SubscriptionRow = Tables<'subscriptions'>;
type GoalRow = Tables<'goals'>;

export function subscriptionFromRow(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    cost: row.cost,
    status: row.status as SubscriptionStatus,
    plan: row.plan as SubscriptionPlan,
    // La columna es `date` ("2026-10-11"): se devuelve como ISO de la medianoche LOCAL para
    // que `new Date(nextChargeAt)` muestre el día correcto (no el anterior por UTC).
    nextChargeAt: parseLocalDate(row.next_charge_at).toISOString(),
  };
}

export function goalFromRow(row: GoalRow): Goal {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    targetAmount: row.target_amount,
    currentAmount: row.current_amount,
    progressPercent: percent(row.current_amount, row.target_amount),
  };
}
