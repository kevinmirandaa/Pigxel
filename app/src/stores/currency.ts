import { create } from 'zustand';

import type { CurrencyCode } from '@/data';
import { setActiveCurrency } from '@/lib/currency';

interface CurrencyState {
  code: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

/** Moneda principal en memoria: al cambiarla actualiza el formateador y re-renderiza a quien la use. */
export const useCurrencyStore = create<CurrencyState>((set) => ({
  code: 'CRC',
  setCurrency: (code) => {
    setActiveCurrency(code);
    set({ code });
  },
}));

/** Llamar en pantallas que dan formato a montos para re-renderizar al cambiar de moneda. */
export const useCurrency = (): CurrencyCode => useCurrencyStore((s) => s.code);
