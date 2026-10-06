import { create } from 'zustand';

import type { AuthSession } from '@/data';

type SessionStatus = 'loading' | 'signed-out' | 'signed-in';

interface SessionState {
  status: SessionStatus;
  session: AuthSession | null;
  /**
   * Recuperación de contraseña en curso: verificar el código crea una sesión en Supabase, pero el usuario
   * todavía debe elegir su nueva contraseña, así que NO se le deja entrar a la app hasta terminar.
   */
  recovering: boolean;
  setSession: (session: AuthSession | null) => void;
  setRecovering: (recovering: boolean) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  status: 'loading',
  session: null,
  recovering: false,
  setSession: (session) => set({ session, status: session ? 'signed-in' : 'signed-out' }),
  setRecovering: (recovering) => set({ recovering }),
}));

/** ¿Puede ver la app? Sesión iniciada y fuera del flujo de recuperación de contraseña. */
export const selectIsAuthenticated = (s: SessionState): boolean =>
  s.status === 'signed-in' && !s.recovering;
