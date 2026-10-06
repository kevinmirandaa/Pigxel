/**
 * Simulador "¿qué pasa si compro esto?": no toca la base de datos ni bloquea nada.
 * Sin dependencias de React Native.
 */
import type { SpendingLimit } from '../../data/models';

/** Te quedarán = saldo actual − monto. Si es negativo, la UI lo muestra en rojo (ver consultar). */
export function computeRemaining(balance: number, amount: number): number {
  return balance - amount;
}

export type LimitStatus = 'off' | 'ok' | 'near' | 'exceeded';

export interface ConsultCalcInput {
  /** Saldo total actual (suma de las cuentas). */
  balance: number;
  /** Monto de la compra que se consulta. */
  amount: number;
  /** Límite de gastos de Ajustes (opcional). */
  limit?: SpendingLimit | null;
  /** Lo gastado en el periodo del límite (`transactions.getSpentInPeriod`). */
  spentInPeriod?: number;
}

export interface ConsultResult {
  /** Saldo − monto (puede ser negativo). */
  remaining: number;
  /** `remaining >= 0`. Informativo: nada se bloquea. */
  canAfford: boolean;
  /** Lo que quedaría del límite tras la compra (puede ser negativo). Solo con límite activo. */
  remainingAfterLimit?: number;
  /** off = sin límite activo · ok · near (> 80 %) · exceeded (> 100 %). */
  limitStatus: LimitStatus;
}

/** Umbral de aviso: gasto del periodo + compra por encima del 80 % del límite. */
export const LIMIT_NEAR_RATIO = 0.8;

const safe = (n: number | undefined): number => (Number.isFinite(n) ? (n as number) : 0);

export function computeConsult({
  balance,
  amount,
  limit,
  spentInPeriod = 0,
}: ConsultCalcInput): ConsultResult {
  const purchase = Math.max(0, safe(amount));
  const remaining = computeRemaining(safe(balance), purchase);
  const base = { remaining, canAfford: remaining >= 0 };

  if (!limit || !limit.enabled || !(limit.amount > 0)) {
    return { ...base, limitStatus: 'off' };
  }

  const projected = Math.max(0, safe(spentInPeriod)) + purchase;
  const limitStatus: LimitStatus =
    projected > limit.amount
      ? 'exceeded'
      : projected > limit.amount * LIMIT_NEAR_RATIO
        ? 'near'
        : 'ok';
  return { ...base, remainingAfterLimit: limit.amount - projected, limitStatus };
}
