/**
 * Fechas y costos por plan de suscripción. Sin dependencias de React Native.
 * Las fechas "solo día" (columna `date`) se tratan en HORA LOCAL: `new Date('2026-10-11')` las
 * interpreta como UTC y en Costa Rica (UTC−6) mostraría el día anterior; usa `parseLocalDate`.
 */
import type { SubscriptionPlan } from '../data/models';

/** Suma `months` meses de forma segura: 31 ene + 1 mes = 28/29 feb. */
function addMonthsClamped(from: Date, months: number): Date {
  const target = new Date(from.getFullYear(), from.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(from.getDate(), lastDay));
}

/** Próximo cobro: +1 semana / +1 mes / +1 año desde `from` (a medianoche local). */
export function addPlanPeriod(from: Date, plan: SubscriptionPlan): Date {
  switch (plan) {
    case 'weekly':
      return new Date(from.getFullYear(), from.getMonth(), from.getDate() + 7);
    case 'monthly':
      return addMonthsClamped(from, 1);
    case 'yearly':
      return addMonthsClamped(from, 12);
  }
}

/** "2026-10-11" en hora local (formato de la columna `date`). */
export function toLocalDateString(date: Date): string {
  const y = String(date.getFullYear()).padStart(4, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** "2026-10-11" → Date a medianoche LOCAL. */
export function parseLocalDate(value: string): Date {
  const [y = '1970', m = '1', d = '1'] = value.slice(0, 10).split('-');
  return new Date(Number(y), Number(m) - 1, Number(d));
}

/** Costo mensual equivalente (sin redondear): semanal × 52/12, anual ÷ 12. */
export function monthlyEquivalent(cost: number, plan: SubscriptionPlan): number {
  switch (plan) {
    case 'weekly':
      return (cost * 52) / 12;
    case 'monthly':
      return cost;
    case 'yearly':
      return cost / 12;
  }
}
