/**
 * Lógica pura de la pestaña Actividad (sin React Native): agrupación por día, balance del modo "Ambos",
 * día seleccionado de la gráfica y filtro por categoría. Se prueba en `scripts/unit.test.ts`.
 */
import type { SeriesPoint, Transaction, TransactionFilterType } from '../../data/models';
import { dayHeading, dayKey, formatTime, weekdayPosition } from '../../lib/dates';

export type ActivityMode = 'expense' | 'income' | 'both';

export const ACTIVITY_MODES: readonly { value: ActivityMode; label: string }[] = [
  { value: 'expense', label: 'Gastos' },
  { value: 'income', label: 'Ingresos' },
  { value: 'both', label: 'Ambos' },
];

/** Texto gris sobre el total: "Gastos" / "Ingresos" / "Balance" (modo Ambos). */
export const MODE_CAPTION: Record<ActivityMode, string> = {
  expense: 'Gastos',
  income: 'Ingresos',
  both: 'Balance',
};

/** `Ambos` consulta todos los tipos. */
export const modeToFilterType = (mode: ActivityMode): TransactionFilterType =>
  mode === 'both' ? 'all' : mode;

/** Valor con signo de un movimiento: ingresos +, gastos −. */
export const signedAmount = (t: Pick<Transaction, 'type' | 'amount'>): number =>
  t.type === 'income' ? t.amount : -t.amount;

/** Balance de la semana (modo Ambos): ingresos − gastos. */
export const computeBalance = (income: number, expense: number): number => income - expense;

/**
 * Serie neta diaria (modo Ambos): ingresos − gastos por cada día. Las dos series deben tener las mismas etiquetas
 * en el mismo orden (Lun…Dom); si falta un día se toma 0. La suma de la serie = balance.
 */
export function netDailySeries(
  income: readonly SeriesPoint[],
  expense: readonly SeriesPoint[],
): SeriesPoint[] {
  const spent = new Map(expense.map((p) => [p.label, p.value]));
  const labels = income.length >= expense.length ? income : expense;
  const earned = new Map(income.map((p) => [p.label, p.value]));
  return labels.map((p) => ({
    label: p.label,
    value: (earned.get(p.label) ?? 0) - (spent.get(p.label) ?? 0),
  }));
}

/** Día que se selecciona por defecto en la gráfica: hoy (posición Lun=0 … Dom=6). */
export const defaultSelectedDay = (now: Date = new Date()): number => weekdayPosition(now);

export interface DayGroup {
  /** "2026-10-06" (hora local). */
  key: string;
  /** "Hoy" · "Ayer" · "martes 6 de octubre". */
  label: string;
  items: Transaction[];
}

/** Agrupa por día local conservando el orden recibido (más reciente primero). */
export function groupTransactionsByDay(
  transactions: readonly Transaction[],
  now: Date = new Date(),
): DayGroup[] {
  const groups: DayGroup[] = [];
  const byKey = new Map<string, DayGroup>();
  for (const t of transactions) {
    const date = new Date(t.occurredAt);
    const key = dayKey(date);
    let group = byKey.get(key);
    if (!group) {
      group = { key, label: dayHeading(date, now), items: [] };
      byKey.set(key, group);
      groups.push(group);
    }
    group.items.push(t);
  }
  return groups;
}

/** Categoría sin asignar en el filtro. */
export const NO_CATEGORY = '__none__';

/** Filtro local por categoría: `null` = todas; `NO_CATEGORY` = movimientos sin categoría. */
export function filterByCategory(
  transactions: readonly Transaction[],
  categoryId: string | null,
): Transaction[] {
  if (categoryId === null) return [...transactions];
  if (categoryId === NO_CATEGORY) return transactions.filter((t) => t.categoryId === null);
  return transactions.filter((t) => t.categoryId === categoryId);
}

/** "Compras, 8:24 AM" (segunda línea de la fila). */
export const transactionSubtitle = (t: Pick<Transaction, 'categoryLabel' | 'occurredAt'>): string =>
  `${t.categoryLabel}, ${formatTime(new Date(t.occurredAt))}`;
