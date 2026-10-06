import type { QueryClient } from '@tanstack/react-query';

import { ACCOUNTS_KEY, HOME_SUMMARY_KEY } from './accounts/queryKeys';
import { GOALS_KEY } from './goals/queryKeys';
import { SUBSCRIPTIONS_KEY } from './subscriptions/queryKeys';
import { CONSULT_CONTEXT_KEY } from './consult/hooks/useConsult';
import { activityKeys } from './transactions/queryKeys';

/**
 * Invalida todo lo que depende de los datos financieros (Cuentas, Actividad, Consultar). Llamarla tras crear
 * o cambiar cuentas, movimientos, suscripciones u objetivos (etapas 7.3+).
 */
export function invalidateFinancialQueries(queryClient: QueryClient): Promise<unknown> {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: HOME_SUMMARY_KEY }),
    queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY }),
    queryClient.invalidateQueries({ queryKey: GOALS_KEY }),
    queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY }),
    queryClient.invalidateQueries({ queryKey: activityKeys.all }),
    queryClient.invalidateQueries({ queryKey: CONSULT_CONTEXT_KEY }),
  ]);
}
