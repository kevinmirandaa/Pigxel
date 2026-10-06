import type { Repositories } from '../../data/repositories';
import type { SpendingLimit } from '../../data/models';

export interface ConsultContext {
  balance: number;
  limit: SpendingLimit;
  spentInPeriod: number;
}

/**
 * Datos que necesita la pantalla Consultar: saldo total, límite de Ajustes y lo gastado en el
 * periodo del límite. Con esto + lo que escribe el usuario se llama `computeConsult`.
 */
export async function getConsultContext(
  repos: Pick<Repositories, 'accounts' | 'transactions' | 'settings'>,
): Promise<ConsultContext> {
  const [balance, settings] = await Promise.all([
    repos.accounts.getTotalBalance(),
    repos.settings.getSettings(),
  ]);
  const limit = settings.spendingLimit;
  const spentInPeriod = limit.enabled ? await repos.transactions.getSpentInPeriod(limit.period) : 0;
  return { balance, limit, spentInPeriod };
}
