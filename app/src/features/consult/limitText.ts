import type { SpendingLimit } from '../../data/models';
import { formatCurrency } from '../../lib/formatCurrency';
import type { ConsultResult } from './calc';

const PERIOD_LABEL = { weekly: 'semanal', monthly: 'mensual' } as const;

/**
 * Línea discreta bajo las píldoras de Consultar. `null` si no hay límite activo o todo va bien (`ok`).
 * Nunca bloquea nada: solo informa.
 */
export function limitLine(
  result: ConsultResult,
  limit: SpendingLimit | null | undefined,
  spentInPeriod: number,
  amount: number,
): string | null {
  if (!limit || !limit.enabled || result.limitStatus === 'off' || result.limitStatus === 'ok')
    return null;
  const period = PERIOD_LABEL[limit.period];
  if (result.limitStatus === 'exceeded') {
    const over = Math.max(0, spentInPeriod) + Math.max(0, amount) - limit.amount;
    return `Superarías tu límite ${period} en ${formatCurrency(over)}`;
  }
  const percent = Math.round(
    ((Math.max(0, spentInPeriod) + Math.max(0, amount)) / limit.amount) * 100,
  );
  return `Con esto usarías el ${percent} % de tu límite ${period}`;
}
