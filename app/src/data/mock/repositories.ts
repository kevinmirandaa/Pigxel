import type {
  AccountRepository,
  AuthRepository,
  CategoryRepository,
  GoalRepository,
  Repositories,
  SettingsRepository,
  SubscriptionRepository,
  TransactionRepository,
} from '../repositories';
import type { AuthSession, TransactionType } from '../models';
import { env } from '@/core/config/env';
import { monthlyEquivalent } from '@/lib/planPeriod';
import { percent } from '@/lib/utils';
import { periodRange } from '../supabase/week';
import * as seed from './data';

const delay = <T>(value: T, ms = 120): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

let counter = 0;
const newId = (prefix: string) => `${prefix}-${Date.now()}-${++counter}`;

export function createMockRepositories(): Repositories {
  // Estado en memoria: se reinicia al recargar la app.
  const accounts = [...seed.accounts];
  const categories = [...seed.categories];
  const transactions = [...seed.transactions];
  const subscriptions = [...seed.subscriptions];
  const goals = [...seed.goals];
  let profile = { ...seed.profile };
  let settings = { ...seed.settings };

  let session: AuthSession | null = env.mockSignedIn
    ? { userId: profile.id, email: profile.email }
    : null;
  const listeners = new Set<(s: AuthSession | null) => void>();
  const setSession = (s: AuthSession | null) => {
    session = s;
    listeners.forEach((l) => l(s));
  };

  const auth: AuthRepository = {
    getSession: () => delay(session),
    async signUp({ email }) {
      const s = { userId: profile.id, email };
      setSession(s);
      return delay(s);
    },
    async signIn({ email }) {
      const s = { userId: profile.id, email };
      setSession(s);
      return delay(s);
    },
    async signOut() {
      setSession(null);
    },
    requestPasswordReset: () => delay(undefined),
    verifyResetCode: () => delay(undefined),
    updatePassword: () => delay(undefined),
    changePassword: () => delay(undefined),
    onAuthStateChange(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  const accountsRepo: AccountRepository = {
    list: () => delay([...accounts]),
    async create({ name, icon, initialAmount, description }) {
      const account = {
        id: newId('acc'),
        name,
        description: description?.trim() || null,
        icon,
        initialAmount,
        balance: initialAmount,
      };
      accounts.push(account);
      return delay(account);
    },
    getTotalBalance: () => delay(seed.MOCK_TOTAL_BALANCE),
  };

  const categoriesRepo: CategoryRepository = {
    list: () => delay([...categories]),
    async create({ name, icon }) {
      const category = { id: newId('cat'), name, icon };
      categories.push(category);
      return delay(category);
    },
  };

  const transactionsRepo: TransactionRepository = {
    async list({ type = 'all', search, limit } = {}) {
      let result = transactions
        .filter((t) => type === 'all' || t.type === type)
        .filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
      if (limit) result = result.slice(0, limit);
      return delay(result);
    },
    async create(input) {
      const account = accounts.find((a) => a.id === input.accountId);
      const category = categories.find((c) => c.id === input.categoryId);
      const tx = {
        ...input,
        id: newId('tx'),
        categoryLabel: category?.name ?? (input.type === 'income' ? 'Ingreso' : 'Sin categoría'),
        icon: category?.icon ?? (input.type === 'income' ? '💰' : '💸'),
        occurredAt: new Date().toISOString(),
      };
      transactions.unshift(tx);
      if (account) account.balance += input.type === 'income' ? input.amount : -input.amount;
      return delay(tx);
    },
    getPeriodTotal: (type: TransactionType) =>
      delay(type === 'expense' ? seed.MOCK_PERIOD_EXPENSES : seed.MOCK_PERIOD_INCOME),
    getWeeklySeries: () => delay([...seed.weeklyExpenseSeries]),
    async getSpentInPeriod(period) {
      const { start, end } = periodRange(period);
      const spent = transactions
        .filter((t) => t.type === 'expense')
        .filter((t) => {
          const at = new Date(t.occurredAt).getTime();
          return at >= start.getTime() && at < end.getTime();
        })
        .reduce((sum, t) => sum + t.amount, 0);
      return delay(spent);
    },
  };

  const subscriptionsRepo: SubscriptionRepository = {
    list: () => delay([...subscriptions]),
    async create({ name, icon, cost, status, plan }) {
      const sub = {
        id: newId('sub'),
        name,
        icon,
        cost,
        status,
        plan,
        nextChargeAt: new Date().toISOString(),
      };
      subscriptions.push(sub);
      return delay(sub);
    },
    async getMonthlyCost() {
      const total = subscriptions
        .filter((sub) => sub.status === 'active')
        .reduce((sum, sub) => sum + monthlyEquivalent(sub.cost, sub.plan), 0);
      return delay(Math.round(total));
    },
  };

  const goalsRepo: GoalRepository = {
    list: () => delay([...goals]),
    async create({ name, icon, targetAmount, initialAmount }) {
      const goal = {
        id: newId('goal'),
        name,
        icon,
        targetAmount,
        currentAmount: initialAmount,
        progressPercent: percent(initialAmount, targetAmount),
      };
      goals.push(goal);
      return delay(goal);
    },
  };

  const settingsRepo: SettingsRepository = {
    getProfile: () => delay(profile),
    async updateProfile(patch) {
      profile = { ...profile, ...patch };
      return delay(profile);
    },
    getSettings: () => delay(settings),
    async updateSettings(patch) {
      settings = { ...settings, ...patch };
      return delay(settings);
    },
    async deleteAccount() {
      await auth.signOut();
    },
  };

  return {
    auth,
    accounts: accountsRepo,
    categories: categoriesRepo,
    transactions: transactionsRepo,
    subscriptions: subscriptionsRepo,
    goals: goalsRepo,
    settings: settingsRepo,
  };
}
