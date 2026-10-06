import type {
  Account,
  AuthSession,
  Category,
  Emoji,
  Goal,
  Id,
  SeriesPoint,
  SpendingPeriod,
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
  Transaction,
  TransactionFilterType,
  TransactionType,
  UserProfile,
  UserSettings,
} from '../models';

export interface AuthRepository {
  getSession(): Promise<AuthSession | null>;
  signUp(input: { name: string; email: string; password: string }): Promise<AuthSession>;
  signIn(input: { email: string; password: string }): Promise<AuthSession>;
  signOut(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  verifyResetCode(input: { email: string; code: string }): Promise<void>;
  updatePassword(newPassword: string): Promise<void>;
  /** Cambio desde Ajustes: verifica la contraseña actual antes de aplicar la nueva. */
  changePassword(input: { currentPassword: string; newPassword: string }): Promise<void>;
  /** Devuelve la función para cancelar la suscripción. */
  onAuthStateChange(listener: (session: AuthSession | null) => void): () => void;
}

export interface AccountRepository {
  list(): Promise<Account[]>;
  create(input: {
    name: string;
    icon: Emoji;
    initialAmount: number;
    /** Subtítulo opcional de la fila (ej. "Banco de Costa Rica"). */
    description?: string | null;
  }): Promise<Account>;
  getTotalBalance(): Promise<number>;
}

export interface CategoryRepository {
  list(): Promise<Category[]>;
  create(input: { name: string; icon: Emoji }): Promise<Category>;
}

export interface TransactionFilter {
  type?: TransactionFilterType;
  search?: string;
  limit?: number;
}

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  title: string;
  accountId: Id;
  categoryId: Id | null;
}

export interface TransactionRepository {
  list(filter?: TransactionFilter): Promise<Transaction[]>;
  create(input: CreateTransactionInput): Promise<Transaction>;
  /** Total del periodo para el encabezado de Actividad. */
  getPeriodTotal(type: TransactionType): Promise<number>;
  /** Serie semanal (Lun–Dom) para la gráfica de Actividad. */
  getWeeklySeries(type: TransactionType): Promise<SeriesPoint[]>;
  /**
   * Gastos del periodo en curso (semana lunes–domingo o mes calendario, hora local) para
   * compararlos con `settings.spendingLimit`. El límite solo informa: nunca bloquea.
   */
  getSpentInPeriod(period: SpendingPeriod): Promise<number>;
}

export interface SubscriptionRepository {
  list(): Promise<Subscription[]>;
  create(input: {
    name: string;
    icon: Emoji;
    cost: number;
    status: SubscriptionStatus;
    plan: SubscriptionPlan;
  }): Promise<Subscription>;
  /** Suma de las suscripciones ACTIVAS normalizada a mensual (semanal ×52/12, anual ÷12), entera. */
  getMonthlyCost(): Promise<number>;
}

export interface GoalRepository {
  list(): Promise<Goal[]>;
  create(input: {
    name: string;
    icon: Emoji;
    targetAmount: number;
    initialAmount: number;
  }): Promise<Goal>;
}

export interface SettingsRepository {
  getProfile(): Promise<UserProfile>;
  updateProfile(patch: Partial<Omit<UserProfile, 'id'>>): Promise<UserProfile>;
  getSettings(): Promise<UserSettings>;
  updateSettings(patch: Partial<UserSettings>): Promise<UserSettings>;
  /**
   * Elimina la cuenta y todos sus datos. En Supabase llama a la Edge Function `delete-account` (la despliega el
   * dueño del proyecto); si no existe lanza "Esta función aún no está disponible". El mock solo cierra sesión.
   */
  deleteAccount(): Promise<void>;
}

export interface Repositories {
  auth: AuthRepository;
  accounts: AccountRepository;
  categories: CategoryRepository;
  transactions: TransactionRepository;
  subscriptions: SubscriptionRepository;
  goals: GoalRepository;
  settings: SettingsRepository;
}
