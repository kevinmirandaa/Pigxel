/**
 * Entrada de montos en colones (enteros). Sin dependencias de React Native.
 * El campo guarda solo dígitos ("700000") y muestra "¢700.000" mientras se escribe.
 */
export const AMOUNT_MAX = 999_999_999;

/** Deja solo dígitos, quita ceros a la izquierda y recorta al tope (≤ 999.999.999). */
export function sanitizeAmountDigits(raw: string): string {
  let digits = raw.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  if (digits.length > 0 && Number(digits) > AMOUNT_MAX) digits = digits.slice(0, -1);
  return digits;
}

/** "700000" → "700.000" (vacío se queda vacío). */
export function formatAmountDigits(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** Texto del campo: "¢700.000", o vacío para que se vea el placeholder. */
export function formatAmountInput(raw: string): string {
  const digits = sanitizeAmountDigits(raw);
  return digits === '' ? '' : `¢${formatAmountDigits(digits)}`;
}

/** Valor numérico de lo escrito ("¢700.000" → 700000; vacío → 0). */
export function parseAmountInput(text: string): number {
  const digits = sanitizeAmountDigits(text);
  return digits === '' ? 0 : Number(digits);
}
