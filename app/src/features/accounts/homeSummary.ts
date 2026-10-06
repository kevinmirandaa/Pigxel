import type { Account, Goal, Subscription, Transaction } from '../../data/models';
import type { Repositories } from '../../data/repositories';

export interface HomeSummary {
  /** Saldo total (suma de las cuentas). */
  totalBalance: number;
  accounts: Account[];
  /** Los 3 movimientos más recientes ("Recientes"). */
  recent: Transaction[];
  /** Suscripciones (orden por próximo cobro). */
  subscriptions: Subscription[];
  /** Para la pestaña "Objetivos" de la misma pantalla (sin pedirlos aparte). */
  goals: Goal[];
}

export const HOME_RECENT_LIMIT = 3;

/** Todo lo que necesita la pantalla Cuentas / Cuentas·Objetivos. Solo lectura. */
export async function getHomeSummary(
  repos: Pick<Repositories, 'accounts' | 'transactions' | 'subscriptions' | 'goals'>,
): Promise<HomeSummary> {
  const [totalBalance, accounts, recent, subscriptions, goals] = await Promise.all([
    repos.accounts.getTotalBalance(),
    repos.accounts.list(),
    repos.transactions.list({ limit: HOME_RECENT_LIMIT }),
    repos.subscriptions.list(),
    repos.goals.list(),
  ]);
  return { totalBalance, accounts, recent, subscriptions, goals };
}
