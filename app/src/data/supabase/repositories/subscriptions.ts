import { addPlanPeriod, monthlyEquivalent, toLocalDateString } from '../../../lib/planPeriod';
import { validateEmoji } from '../../../lib/emoji';
import type { SubscriptionPlan, SubscriptionStatus } from '../../models';
import type { SubscriptionRepository } from '../../repositories';
import { FriendlyError, toFriendlyError } from '../errors';
import { subscriptionFromRow } from '../mappers';
import type { PigxelClient } from '../types';

const PLANS: SubscriptionPlan[] = ['weekly', 'monthly', 'yearly'];
const STATUSES: SubscriptionStatus[] = ['active', 'inactive'];

export function createSubscriptionRepository(client: PigxelClient): SubscriptionRepository {
  return {
    async list() {
      const { data, error } = await client
        .from('subscriptions')
        .select('*')
        .order('next_charge_at', { ascending: true });
      if (error) throw toFriendlyError(error);
      // Desempate por nombre (alfabético en español) dentro de la misma fecha.
      return (data ?? [])
        .map(subscriptionFromRow)
        .sort(
          (a, b) =>
            a.nextChargeAt.localeCompare(b.nextChargeAt) ||
            a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }),
        );
    },

    async create({ name, icon, cost, status, plan }) {
      const cleanName = name.trim();
      if (!cleanName) throw new FriendlyError('Ingresa un nombre');
      if (!validateEmoji(icon)) throw new FriendlyError('Elige un solo emoji');
      if (!Number.isInteger(cost) || cost <= 0) {
        throw new FriendlyError('El costo debe ser un entero mayor que 0');
      }
      if (!PLANS.includes(plan)) throw new FriendlyError('Elige un plan válido');
      if (!STATUSES.includes(status)) throw new FriendlyError('Elige un estado válido');

      const { data, error } = await client
        .from('subscriptions')
        .insert({
          name: cleanName,
          icon,
          cost,
          status,
          plan,
          // El formulario no pide fecha: próximo cobro = hoy + 1 semana / mes / año.
          next_charge_at: toLocalDateString(addPlanPeriod(new Date(), plan)),
        })
        .select('*')
        .single();
      if (error) throw toFriendlyError(error);
      return subscriptionFromRow(data);
    },

    async getMonthlyCost() {
      const { data, error } = await client
        .from('subscriptions')
        .select('cost, plan')
        .eq('status', 'active');
      if (error) throw toFriendlyError(error);
      const total = (data ?? []).reduce(
        (sum, row) => sum + monthlyEquivalent(row.cost, row.plan as SubscriptionPlan),
        0,
      );
      return Math.round(total);
    },
  };
}
