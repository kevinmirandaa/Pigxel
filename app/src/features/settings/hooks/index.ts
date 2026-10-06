import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getRepositories } from '@/data';
import type { UserProfile, UserSettings } from '@/data';

import { PROFILE_KEY, SETTINGS_KEY } from '../queryKeys';

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: () => getRepositories().settings.getProfile(),
  });
}

export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => getRepositories().settings.getSettings(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<Omit<UserProfile, 'id'>>) =>
      getRepositories().settings.updateProfile(patch),
    onSuccess: (profile) => queryClient.setQueryData(PROFILE_KEY, profile),
  });
}

/** Actualiza ajustes con caché optimista: se ve al instante y se revierte si el servidor falla. */
export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<UserSettings>) => getRepositories().settings.updateSettings(patch),
    onMutate: async (patch) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_KEY });
      const previous = queryClient.getQueryData<UserSettings>(SETTINGS_KEY);
      if (previous) queryClient.setQueryData<UserSettings>(SETTINGS_KEY, { ...previous, ...patch });
      return { previous };
    },
    onError: (_error, _patch, context) => {
      if (context?.previous) queryClient.setQueryData(SETTINGS_KEY, context.previous);
    },
    onSuccess: (settings) => queryClient.setQueryData(SETTINGS_KEY, settings),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: { currentPassword: string; newPassword: string }) =>
      getRepositories().auth.changePassword(input),
  });
}
