import { useEffect } from 'react';

import { selectIsAuthenticated, useSessionStore } from '@/stores/session';
import { useCurrencyStore } from '@/stores/currency';

import { useSettings } from './hooks';

function Sync() {
  const { data } = useSettings();
  const setCurrency = useCurrencyStore((s) => s.setCurrency);
  const code = data?.currency;
  useEffect(() => {
    if (code) setCurrency(code);
  }, [code, setCurrency]);
  return null;
}

/** Lleva la moneda de los ajustes al formateador de montos de toda la app (solo con sesión). Va dentro del QueryClientProvider. */
export function CurrencySync() {
  const authenticated = useSessionStore(selectIsAuthenticated);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);
  useEffect(() => {
    if (!authenticated) setCurrency('CRC');
  }, [authenticated, setCurrency]);
  return authenticated ? <Sync /> : null;
}
