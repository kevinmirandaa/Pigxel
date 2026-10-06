import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Appearance, LanguageCode } from '@/data';

interface PreferencesState {
  appearance: Appearance;
  language: LanguageCode;
  setAppearance: (appearance: Appearance) => void;
  setLanguage: (language: LanguageCode) => void;
}

/** Preferencias locales (caché del dispositivo). La fuente de verdad será user_settings. */
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      appearance: 'system',
      language: 'es',
      setAppearance: (appearance) => set({ appearance }),
      setLanguage: (language) => set({ language }),
    }),
    { name: 'pigxel-preferences', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
