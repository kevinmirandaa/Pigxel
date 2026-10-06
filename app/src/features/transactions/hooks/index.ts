import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getRepositories } from '@/data';

import { computeBalance, modeToFilterType, netDailySeries, type ActivityMode } from '../activity';
import { invalidateFinancialQueries } from '../../invalidate';
import { activityKeys } from '../queryKeys';
import type { CreateTransactionFormInput } from '../schemas';

export interface WeeklyActivity {
  /** Total de la semana: gastos, ingresos o balance (ingresos − gastos) en el modo Ambos. */
  total: number;
  /** Serie Lun–Dom para la gráfica (en Ambos, el neto diario). */
  series: { label: string; value: number }[];
}

/** Total y serie de la semana actual (lunes–domingo, hora local) según el modo. */
export function useWeeklyActivity(mode: ActivityMode) {
  return useQuery<WeeklyActivity>({
    queryKey: activityKeys.weekly(mode),
    queryFn: async () => {
      const { transactions } = getRepositories();
      if (mode === 'both') {
        const [income, expense, incomeSeries, expenseSeries] = await Promise.all([
          transactions.getPeriodTotal('income'),
          transactions.getPeriodTotal('expense'),
          transactions.getWeeklySeries('income'),
          transactions.getWeeklySeries('expense'),
        ]);
        return {
          total: computeBalance(income, expense),
          series: netDailySeries(incomeSeries, expenseSeries),
        };
      }
      const [total, series] = await Promise.all([
        transactions.getPeriodTotal(mode),
        transactions.getWeeklySeries(mode),
      ]);
      return { total, series };
    },
  });
}

/** Movimientos (más recientes primero) del modo y la búsqueda actuales. */
export function useTransactionList(mode: ActivityMode, search: string) {
  return useQuery({
    queryKey: activityKeys.list(mode, search),
    queryFn: () =>
      getRepositories().transactions.list({
        type: modeToFilterType(mode),
        search: search.trim() || undefined,
      }),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTransactionFormInput) => getRepositories().transactions.create(input),
    onSuccess: () => invalidateFinancialQueries(queryClient),
  });
}
