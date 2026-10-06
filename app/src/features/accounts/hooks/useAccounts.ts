import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getRepositories } from '@/data';

import { invalidateFinancialQueries } from '../../invalidate';
import { ACCOUNTS_KEY } from '../queryKeys';
import type { CreateAccountInput } from '../schemas';

export function useAccounts() {
  return useQuery({ queryKey: ACCOUNTS_KEY, queryFn: () => getRepositories().accounts.list() });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAccountInput) => getRepositories().accounts.create(input),
    onSuccess: () => invalidateFinancialQueries(queryClient),
  });
}
