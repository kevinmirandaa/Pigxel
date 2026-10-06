import type { SubscriptionPlan } from '../../data/models';

/** Plan en español para mostrar: Semanal / Mensual / Anual. */
export const PLAN_LABEL: Record<SubscriptionPlan, string> = {
  weekly: 'Semanal',
  monthly: 'Mensual',
  yearly: 'Anual',
};
