import type { Transaction, TransactionType } from '../../models';
import type { TransactionRepository } from '../../repositories';
import { FriendlyError, toFriendlyError } from '../errors';
import { transactionFromRow, type TransactionWithCategory } from '../mappers';
import type { PigxelClient } from '../types';
import { buildWeeklySeries, periodRange, sumAmounts, weekRange } from '../week';

/** Movimiento + su categoría (clave foránea compuesta: se nombra para evitar ambigüedad). */
const SELECT_WITH_CATEGORY =
  '*, category:categories!transactions_category_id_user_id_fkey(name, icon)';

const WRITE_ERRORS = {
  '23503': 'La cuenta o la categoría no es válida',
  '23514': 'El monto debe ser mayor que 0',
};

/** Sin mayúsculas ni acentos: "cafe" encuentra "Café". */
const fold = (text: string): string => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Tope de filas al buscar (la búsqueda por texto se filtra en el cliente, ver `list`). */
const SEARCH_FETCH_LIMIT = 1000;

export function createTransactionRepository(client: PigxelClient): TransactionRepository {
  async function weekRows(type: TransactionType) {
    const { start, end } = weekRange();
    const { data, error } = await client
      .from('transactions')
      .select('amount, occurred_at')
      .eq('type', type)
      .gte('occurred_at', start.toISOString())
      .lt('occurred_at', end.toISOString());
    if (error) throw toFriendlyError(error);
    return data ?? [];
  }

  return {
    async list({ type = 'all', search, limit } = {}) {
      const term = search?.trim() ?? '';
      let query = client
        .from('transactions')
        .select(SELECT_WITH_CATEGORY)
        .order('occurred_at', { ascending: false });
      if (type !== 'all') query = query.eq('type', type);
      // Con texto de búsqueda se filtra por título o categoría (insensible a mayúsculas y acentos)
      // en el cliente: PostgREST no combina OR entre columnas propias y de una tabla embebida.
      query = query.limit(term ? SEARCH_FETCH_LIMIT : (limit ?? SEARCH_FETCH_LIMIT));

      const { data, error } = await query;
      if (error) throw toFriendlyError(error);

      let result: Transaction[] = ((data ?? []) as unknown as TransactionWithCategory[]).map(
        transactionFromRow,
      );
      if (term) {
        const needle = fold(term);
        result = result.filter((t) => fold(`${t.title} ${t.categoryLabel}`).includes(needle));
      }
      return limit ? result.slice(0, limit) : result;
    },

    async create({ type, amount, title, accountId, categoryId }) {
      if (!Number.isInteger(amount) || amount <= 0) {
        throw new FriendlyError('El monto debe ser un entero mayor que 0');
      }
      const { data, error } = await client
        .from('transactions')
        .insert({
          type,
          amount,
          title: title.trim(),
          account_id: accountId,
          category_id: categoryId,
        })
        .select(SELECT_WITH_CATEGORY)
        .single();
      if (error) throw toFriendlyError(error, WRITE_ERRORS);
      return transactionFromRow(data as unknown as TransactionWithCategory);
    },

    async getPeriodTotal(type) {
      return sumAmounts(await weekRows(type));
    },

    async getWeeklySeries(type) {
      return buildWeeklySeries(await weekRows(type));
    },

    async getSpentInPeriod(period) {
      const { start, end } = periodRange(period);
      const { data, error } = await client
        .from('transactions')
        .select('amount, occurred_at')
        .eq('type', 'expense')
        .gte('occurred_at', start.toISOString())
        .lt('occurred_at', end.toISOString());
      if (error) throw toFriendlyError(error);
      return sumAmounts(data ?? []);
    },
  };
}
