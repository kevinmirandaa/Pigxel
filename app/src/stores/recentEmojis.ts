import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Emoji } from '@/data';

export const MAX_RECENT_EMOJIS = 24;

interface RecentEmojisState {
  recents: Emoji[];
  push: (emoji: Emoji) => void;
}

/** Emojis usados recientemente en el selector (caché del dispositivo). */
export const useRecentEmojisStore = create<RecentEmojisState>()(
  persist(
    (set) => ({
      recents: [],
      push: (emoji) =>
        set((s) => ({
          recents: [emoji, ...s.recents.filter((e) => e !== emoji)].slice(0, MAX_RECENT_EMOJIS),
        })),
    }),
    {
      name: 'pigxel-recent-emojis',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ recents: s.recents }),
    },
  ),
);
