import { useQuery } from '@tanstack/react-query';

import { getRepositories } from '@/data';

import { getHomeSummary } from '../homeSummary';
import { HOME_SUMMARY_KEY } from '../queryKeys';

/** Datos de la pantalla Cuentas. Invalidar `HOME_SUMMARY_KEY` tras crear cuentas, movimientos, etc. */
export function useHomeSummary() {
  return useQuery({
    queryKey: HOME_SUMMARY_KEY,
    queryFn: () => getHomeSummary(getRepositories()),
  });
}
