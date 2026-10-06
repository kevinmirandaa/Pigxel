import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getRepositories } from '@/data';

import { invalidateFinancialQueries } from '../../invalidate';
import { GOALS_KEY } from '../queryKeys';
import type { CreateGoalInput } from '../schemas';

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGoalInput) => getRepositories().goals.create(input),
    onSuccess: () => invalidateFinancialQueries(queryClient),
  });
}

export function useGoals() {
  return useQuery({ queryKey: GOALS_KEY, queryFn: () => getRepositories().goals.list() });
}
