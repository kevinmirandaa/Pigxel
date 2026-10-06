/**
 * Semana actual lunes–domingo en la zona horaria del dispositivo. Sin dependencias de React Native.
 */
import type { SeriesPoint, SpendingPeriod } from '../models';

export const WEEK_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] as const;

/** Lunes = 0 … domingo = 6 (hora local). */
export function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

/** [start, end): lunes 00:00 local de la semana de `now` hasta el lunes siguiente 00:00 local. */
export function weekRange(now: Date = new Date()): { start: Date; end: Date } {
  const sinceMonday = weekdayIndex(now);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - sinceMonday);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - sinceMonday + 7);
  return { start, end };
}

/** [start, end): primer día del mes 00:00 local hasta el primer día del mes siguiente. */
export function monthRange(now: Date = new Date()): { start: Date; end: Date } {
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
  };
}

/** Rango del periodo del límite de gastos: semana lunes–domingo o mes calendario. */
export function periodRange(
  period: SpendingPeriod,
  now: Date = new Date(),
): { start: Date; end: Date } {
  return period === 'weekly' ? weekRange(now) : monthRange(now);
}

export interface AmountAtRow {
  amount: number;
  occurred_at: string;
}

export function sumAmounts(rows: readonly AmountAtRow[]): number {
  return rows.reduce((total, row) => total + row.amount, 0);
}

/** 7 puntos (Lun…Dom). La suma de la serie siempre es igual a `sumAmounts(rows)`. */
export function buildWeeklySeries(rows: readonly AmountAtRow[]): SeriesPoint[] {
  const values = new Array<number>(7).fill(0);
  for (const row of rows) {
    const day = weekdayIndex(new Date(row.occurred_at));
    values[day] = (values[day] ?? 0) + row.amount;
  }
  return WEEK_LABELS.map((label, i) => ({ label, value: values[i] ?? 0 }));
}
