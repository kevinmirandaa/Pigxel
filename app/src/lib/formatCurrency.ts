import { currencySymbol, getActiveCurrency } from './currency';

export type FormatCurrencyOptions = {
  /** Símbolo de moneda. Por defecto el de la moneda principal de Ajustes (¢ si no hay). */
  symbol?: string;
  /** `¢ 830.000` (saldo grande) en vez de `¢830.000` (filas). */
  spaced?: boolean;
  /** Muestra `+` en montos positivos (ingresos): `+¢718.000`. */
  showPlus?: boolean;
};

/**
 * Formato de los diseños: punto como separador de miles, sin decimales.
 * formatCurrency(830000, { spaced: true }) → "¢ 830.000"
 * formatCurrency(20000)                    → "¢20.000"
 * formatCurrency(-18000)                   → "-¢18.000"
 * formatCurrency(718000, { showPlus: true }) → "+¢718.000"
 */
export function formatCurrency(
  amount: number,
  {
    symbol = currencySymbol(getActiveCurrency()),
    spaced = false,
    showPlus = false,
  }: FormatCurrencyOptions = {},
): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? '-' : showPlus && rounded > 0 ? '+' : '';
  const digits = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}${symbol}${spaced ? ' ' : ''}${digits}`;
}
