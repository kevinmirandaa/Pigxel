import { validateEmoji } from '../../../lib/emoji';
import type { AccountRepository } from '../../repositories';
import { FriendlyError, toFriendlyError } from '../errors';
import { accountFromRow } from '../mappers';
import type { PigxelClient } from '../types';

export function createAccountRepository(client: PigxelClient): AccountRepository {
  async function balances(): Promise<Map<string, number>> {
    const { data, error } = await client.from('account_balances').select('account_id, balance');
    if (error) throw toFriendlyError(error);
    return new Map(
      (data ?? []).flatMap((row) =>
        row.account_id ? [[row.account_id, row.balance ?? 0] as const] : [],
      ),
    );
  }

  return {
    async list() {
      const [accounts, balanceById] = await Promise.all([
        client.from('accounts').select('*').order('created_at', { ascending: true }),
        balances(),
      ]);
      if (accounts.error) throw toFriendlyError(accounts.error);
      return (accounts.data ?? []).map((row) =>
        accountFromRow(row, balanceById.get(row.id) ?? row.initial_amount),
      );
    },

    async create({ name, icon, initialAmount, description }) {
      const cleanName = name.trim();
      if (!cleanName) throw new FriendlyError('Ingresa un nombre');
      if (!validateEmoji(icon)) throw new FriendlyError('Elige un solo emoji');
      if (!Number.isInteger(initialAmount) || initialAmount < 0) {
        throw new FriendlyError('El monto inicial debe ser un entero de 0 o más');
      }
      const cleanDescription = description?.trim() || null;
      if (cleanDescription && cleanDescription.length > 120) {
        throw new FriendlyError('La descripción es demasiado larga (máximo 120 caracteres)');
      }
      const { data, error } = await client
        .from('accounts')
        .insert({
          name: cleanName,
          icon,
          initial_amount: initialAmount,
          description: cleanDescription,
        })
        .select('*')
        .single();
      if (error) throw toFriendlyError(error);
      return accountFromRow(data, data.initial_amount);
    },

    async getTotalBalance() {
      const byId = await balances();
      let total = 0;
      for (const value of byId.values()) total += value;
      return total;
    },
  };
}
