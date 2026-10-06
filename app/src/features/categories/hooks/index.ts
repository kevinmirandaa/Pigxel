import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getRepositories } from '@/data';

import { CATEGORIES_KEY } from '../queryKeys';
import type { CreateCategoryInput } from '../schemas';

/** Categorías del usuario (orden alfabético en español). */
export function useCategories() {
  return useQuery({ queryKey: CATEGORIES_KEY, queryFn: () => getRepositories().categories.list() });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => getRepositories().categories.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}
