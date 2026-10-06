/**
 * Modelo de ancho (responsivo). SIN dependencias de React Native: se prueba en Node.
 *
 * El Figma está dibujado a 402 pt, pero la app debe verse bien de 360 a 440 pt y, en iPad, como una
 * columna centrada de 440 pt como máximo. Regla única:
 *   · los MÁRGENES laterales son fijos (36 pt; 51 en los botones de bienvenida; 39 en el menú de Ajustes);
 *   · el CONTENIDO se estira al ancho que sobra: ancho de contenido = columna − 2 × margen.
 * Los anchos del Figma (330, 300, 351…) ya NO se usan como `width`: quedan en `figmaReference` solo como
 * referencia documental y para las pruebas.
 */

/** Ancho del frame de diseño (iPhone 17 Pro). */
export const DESIGN_WIDTH = 402;
/** Rango soportado de anchos de teléfono. */
export const MIN_SUPPORTED_WIDTH = 360;
export const MAX_PHONE_WIDTH = 440;
/** En pantallas más anchas (iPad) la app es una columna centrada de este ancho como máximo. */
export const MAX_SCREEN_WIDTH = 440;

export const SCREEN_MARGIN = 36;
/** Botones principales de bienvenida (300 de 402). */
export const WELCOME_MARGIN = 51;
/** Menú principal de Ajustes (tarjetas de 328 con margen 39). */
export const SETTINGS_MENU_MARGIN = 39;
/** Bloque del código OTP (317 de 402 → margen 42.5; lo expresamos como 6 pt más hacia dentro que el contenido). */
export const OTP_EXTRA_INSET = 6;

/** Ancho de la columna de la app: nunca más de 440 pt. */
export function columnWidth(screenWidth: number): number {
  return Math.min(Math.max(0, screenWidth), MAX_SCREEN_WIDTH);
}

/** Ancho disponible para el contenido: columna − 2 × margen. */
export function contentWidth(screenWidth: number, margin: number = SCREEN_MARGIN): number {
  return Math.max(0, columnWidth(screenWidth) - margin * 2);
}

/** Sobrante lateral de un elemento que mide `elementWidth` (0 = ocupa exactamente el contenido; <0 = se desborda). */
export function overflow(
  screenWidth: number,
  elementWidth: number,
  margin: number = SCREEN_MARGIN,
): number {
  return contentWidth(screenWidth, margin) - elementWidth;
}

/** Margen izquierdo de un elemento centrado de ancho fijo (tab bar 249, botones de vidrio…). */
export function centeredLeft(screenWidth: number, elementWidth: number): number {
  return (Math.max(0, screenWidth) - elementWidth) / 2;
}

/** Ancho de cada casilla del código: reparten el ancho del bloque con el mismo espaciado. */
export function otpCellWidth(blockWidth: number, count = 6, gap = 5.4): number {
  return Math.max(0, (blockWidth - gap * (count - 1)) / count);
}

/** Ancho del bloque OTP: el contenido menos `OTP_EXTRA_INSET` por lado. */
export function otpBlockWidth(screenWidth: number): number {
  return Math.max(0, contentWidth(screenWidth) - OTP_EXTRA_INSET * 2);
}

/** Control segmentado: se estira hasta un máximo de 252,5 (su ancho en el Figma). */
export function segmentedWidth(content: number, max = 252.5): number {
  return Math.min(content, max);
}

/** Ancho que le queda al texto de una fila (título/subtítulo) tras emoji, espacios y monto. */
export function rowTextWidth(
  content: number,
  opts: {
    inset?: number;
    emoji?: number;
    gap?: number;
    amount?: number;
    paddingRight?: number;
  } = {},
): number {
  const { inset = 18, emoji = 35, gap = 14, amount = 80, paddingRight = 16 } = opts;
  return Math.max(0, content - inset - emoji - gap - amount - 8 - paddingRight);
}

/** Anchos medidos en el Figma (402 pt). SOLO referencia: no usar como `width` de componentes. */
export const figmaReference = {
  contentWidth: 330,
  card: { width: 330, height: 74 },
  primaryButton: { width: 330, height: 60 },
  welcomeButton: { width: 300, height: 60 },
  search: { width: 351, height: 53 },
  segmented: { width: 252.5, height: 48 },
  otpBlock: 317,
  chart: { width: 312, height: 124 },
  tabBar: { width: 249, height: 61 },
  settingsMenuCard: 328,
} as const;
