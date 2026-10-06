/**
 * Moneda principal de la app. Sin dependencias de React Native.
 * LIMITACIÓN DEL MVP: solo cambia el SÍMBOLO mostrado; los montos NO se convierten.
 */
import type { CurrencyCode } from '../data/models';

export const CURRENCIES: readonly { code: CurrencyCode; name: string; symbol: string }[] = [
  { code: 'CRC', name: 'Colón costarricense', symbol: '¢' },
  { code: 'USD', name: 'Dólar estadounidense', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'Libra esterlina', symbol: '£' },
];

export const currencySymbol = (code: CurrencyCode): string =>
  CURRENCIES.find((c) => c.code === code)?.symbol ?? '¢';

let active: CurrencyCode = 'CRC';

/** Moneda activa (la fija `useCurrencyStore` al cargar/cambiar los ajustes). */
export const getActiveCurrency = (): CurrencyCode => active;
export const setActiveCurrency = (code: CurrencyCode): void => {
  active = code;
};
