import { validateEmoji } from '../../../lib/emoji';
import type { GoalRepository } from '../../repositories';
import { FriendlyError, toFriendlyError } from '../errors';
import { goalFromRow } from '../mappers';
import type { PigxelClient } from '../types';

export function createGoalRepository(client: PigxelClient): GoalRepository {
  return {
    async list() {
      const { data, error } = await client
        .from('goals')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw toFriendlyError(error);
      return (data ?? []).map(goalFromRow);
    },

    async create({ name, icon, targetAmount, initialAmount }) {
      const cleanName = name.trim();
      if (!cleanName) throw new FriendlyError('Ingresa un nombre');
      if (!validateEmoji(icon)) throw new FriendlyError('Elige un solo emoji');
      if (!Number.isInteger(targetAmount) || targetAmount <= 0) {
        throw new FriendlyError('El monto objetivo debe ser un entero mayor que 0');
      }
      if (!Number.isInteger(initialAmount) || initialAmount < 0) {
        throw new FriendlyError('El monto inicial debe ser un entero de 0 o más');
      }
      if (initialAmount > targetAmount) {
        throw new FriendlyError('El monto inicial no puede superar el objetivo');
      }

      const { data, error } = await client
        .from('goals')
        .insert({
          name: cleanName,
          icon,
          target_amount: targetAmount,
          current_amount: initialAmount,
        })
        .select('*')
        .single();
      if (error) throw toFriendlyError(error);
      return goalFromRow(data);
    },
  };
}
