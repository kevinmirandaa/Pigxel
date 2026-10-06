/**
 * Modelos de dominio compartidos por features, mock y Supabase.
 * Montos: enteros en colones (sin decimales). Fechas: ISO 8601 (string).
 */
export type Id = string;
export type IsoDate = string;

export type TransactionType = 'income' | 'expense';
export type TransactionFilterType = TransactionType | 'all';

/**
 * Emoji elegido por el usuario, guardado como texto Unicode (1 grafema, ≤16 caracteres).
 * Lo dibuja el sistema (Apple Color Emoji / Noto Color Emoji); no hay imágenes de emojis.
 */
export type Emoji = string;

export type CurrencyCode = 'CRC' | 'USD' | 'EUR' | 'GBP';
export type LanguageCode = 'es' | 'en' | 'pt' | 'fr' | 'de';
export type Appearance = 'light' | 'dark' | 'system';
export type SubscriptionPlan = 'weekly' | 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'inactive';
export type LimitPeriod = 'weekly' | 'monthly';
/** Periodo en que se mide el gasto contra el límite. */
export type SpendingPeriod = LimitPeriod;

export interface AuthSession {
  userId: Id;
  email: string;
}

export interface UserProfile {
  id: Id;
  fullName: string;
  username: string;
  email: string;
  phone: string | null;
}

export interface Account {
  id: Id;
  name: string;
  /** Subtítulo de la fila (ej. "Banco de Costa Rica"). */
  description: string | null;
  icon: Emoji;
  initialAmount: number;
  balance: number;
}

export interface Category {
  id: Id;
  name: string;
  icon: Emoji;
}

export interface Transaction {
  id: Id;
  type: TransactionType;
  title: string;
  /** Siempre positivo; el signo lo da `type`. */
  amount: number;
  accountId: Id;
  categoryId: Id | null;
  /** Texto de la segunda línea en listas (ej. "Compras", "Ingreso"). */
  categoryLabel: string;
  /** Emoji de su categoría, o '💸' (gasto) / '💰' (ingreso) si no tiene. */
  icon: Emoji;
  occurredAt: IsoDate;
}

export interface Subscription {
  id: Id;
  name: string;
  icon: Emoji;
  cost: number;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  nextChargeAt: IsoDate;
}

export interface Goal {
  id: Id;
  name: string;
  icon: Emoji;
  targetAmount: number;
  currentAmount: number;
  /** Avance entero 0–100 ("20% de tu meta"); lo calcula el repositorio. */
  progressPercent: number;
}

export interface SpendingLimit {
  enabled: boolean;
  amount: number;
  period: LimitPeriod;
}

export interface NotificationPrefs {
  subscriptions: boolean;
  goals: boolean;
  limit: boolean;
  activity: boolean;
  news: boolean;
  email: boolean;
}

export interface UserSettings {
  currency: CurrencyCode;
  language: LanguageCode;
  appearance: Appearance;
  spendingLimit: SpendingLimit;
  notifications: NotificationPrefs;
}

export interface SeriesPoint {
  label: string;
  value: number;
}
