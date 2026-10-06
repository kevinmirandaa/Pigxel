/**
 * ¿Qué versión de Emoji puede dibujar el sistema? Evita mostrar "cuadros vacíos" (tofu) en el selector.
 * Valores conservadores: mejor ocultar un emoji muy reciente que dejar elegir uno que no se ve.
 * Sin dependencias de React Native (la plataforma se inyecta para poder probarlo en Node).
 */
export interface PlatformInfo {
  os: string;
  /** iOS: "18.3.1"; Android: nivel de API (número). */
  version: string | number;
}

/** Android: nivel de API mínimo → versión máxima de Emoji (Noto Color Emoji del sistema). */
const ANDROID_TABLE: readonly (readonly [minApi: number, emoji: number])[] = [
  [36, 16], // Android 16
  [35, 15.1], // Android 15
  [34, 15], // Android 14
  [33, 14], // Android 13
  [32, 13.1], // Android 12L
  [31, 13], // Android 12
  [30, 12.1], // Android 11
  [29, 12], // Android 10
  [28, 11], // Android 9
];

/** iOS: [mayor, menor] mínimo → versión máxima de Emoji (Apple Color Emoji). */
const IOS_TABLE: readonly (readonly [major: number, minor: number, emoji: number])[] = [
  [26, 4, 17],
  [18, 4, 16], // iOS 18.4 y 26.0–26.3
  [17, 4, 15.1],
  [16, 4, 15],
  [15, 4, 14],
  [14, 2, 13],
  [13, 2, 12],
];

export function maxEmojiVersion({ os, version }: PlatformInfo): number {
  if (os === 'ios') {
    const [maj = '0', min = '0'] = String(version).split('.');
    const major = Number(maj) || 0;
    const minor = Number(min) || 0;
    for (const [m, n, emoji] of IOS_TABLE) {
      if (major > m || (major === m && minor >= n)) return emoji;
    }
    return 11;
  }
  if (os === 'android') {
    const api = Number(version) || 0;
    for (const [minApi, emoji] of ANDROID_TABLE) if (api >= minApi) return emoji;
    return 5;
  }
  return Number.POSITIVE_INFINITY; // web u otras: sin filtro
}
