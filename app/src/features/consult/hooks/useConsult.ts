import { useQuery } from '@tanstack/react-query';

import { getRepositories } from '@/data';

import { getConsultContext } from '../context';

export const CONSULT_CONTEXT_KEY = ['consult-context'] as const;

/** Saldo, límite y gasto del periodo para Consultar; el cálculo en vivo lo hace `computeConsult`. */
export function useConsultContext() {
  return useQuery({
    queryKey: CONSULT_CONTEXT_KEY,
    queryFn: () => getConsultContext(getRepositories()),
  });
}
