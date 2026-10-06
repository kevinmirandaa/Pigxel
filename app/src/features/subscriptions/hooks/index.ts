import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getRepositories } from '@/data';

import { invalidateFinancialQueries } from '../../invalidate';
import { SUBSCRIPTIONS_KEY } from '../queryKeys';
import type { CreateSubscriptionInput } from '../schemas';

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSubscriptionInput) => getRepositories().subscriptions.create(input),
    onSuccess: () => invalidateFinancialQueries(queryClient),
  });
}

export function useSubscriptions() {
  return useQuery({
    queryKey: SUBSCRIPTIONS_KEY,
    queryFn: () => getRepositories().subscriptions.list(),
  });
}
