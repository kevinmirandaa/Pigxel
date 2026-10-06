import { Redirect } from 'expo-router';
import { useState } from 'react';

import { DevLauncher } from '@/core/dev/DevLauncher';
import { useMinimumTime } from '@/core/useMinimumTime';
import { SplashLogo } from '@/features/auth';
import { selectIsAuthenticated, useSessionStore } from '@/stores';

/** `true` = muestra el lanzador de desarrollo (EXPO_PUBLIC_SHOW_DEV_LAUNCHER=true en .env). Por defecto la app abre directo. */
const SHOW_LAUNCHER = process.env.EXPO_PUBLIC_SHOW_DEV_LAUNCHER === 'true';
/** Tiempo mínimo del splash para que no parpadee cuando la sesión carga rápido. */
const SPLASH_MIN_MS = 700;

/**
 * Splash (logo centrado sobre blanco) mientras se carga la sesión (mínimo ~700 ms) y luego redirige:
 * a Tabs si hay sesión, a Bienvenida si no. Con EXPO_PUBLIC_SHOW_DEV_LAUNCHER=true (solo en `__DEV__`) ofrece antes el lanzador (galería e índice de pantallas).
 */
export default function Index() {
  const status = useSessionStore((s) => s.status);
  const authenticated = useSessionStore(selectIsAuthenticated);
  const minElapsed = useMinimumTime(SPLASH_MIN_MS);
  const [proceed, setProceed] = useState(false);

  if (status === 'loading' || !minElapsed) return <SplashLogo />;
  if (__DEV__ && SHOW_LAUNCHER && !proceed)
    return <DevLauncher onContinue={() => setProceed(true)} />;
  return <Redirect href={authenticated ? '/(tabs)' : '/(auth)/welcome'} />;
}
