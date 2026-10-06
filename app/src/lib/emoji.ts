/**
 * Validación de emojis (texto Unicode). Sin dependencias de React Native.
 * Regla de la app: un ícono de usuario es EXACTAMENTE 1 emoji (1 grafema), ≤ 16 caracteres.
 */

export const EMOJI_MAX_LENGTH = 16;

const ZWJ = 0x200d;
const VS16 = 0xfe0f;
const KEYCAP = 0x20e3;

const inRange = (cp: number, lo: number, hi: number) => cp >= lo && cp <= hi;

const isRegionalIndicator = (cp: number) => inRange(cp, 0x1f1e6, 0x1f1ff);
const isSkinTone = (cp: number) => inRange(cp, 0x1f3fb, 0x1f3ff);
const isTagChar = (cp: number) => inRange(cp, 0xe0020, 0xe007f);

/** Caracteres que dibujan un emoji por sí solos o con VS16 (aprox. de Extended_Pictographic). */
function isPictographic(cp: number): boolean {
  return (
    inRange(cp, 0x1f000, 0x1faff) ||
    inRange(cp, 0x2190, 0x21ff) ||
    inRange(cp, 0x2300, 0x23ff) ||
    inRange(cp, 0x2460, 0x24ff) ||
    inRange(cp, 0x25a0, 0x25ff) ||
    inRange(cp, 0x2600, 0x27bf) ||
    inRange(cp, 0x2900, 0x297f) ||
    inRange(cp, 0x2b00, 0x2bff) ||
    cp === 0x00a9 ||
    cp === 0x00ae ||
    cp === 0x203c ||
    cp === 0x2049 ||
    cp === 0x2122 ||
    cp === 0x2139 ||
    cp === 0x3030 ||
    cp === 0x303d ||
    cp === 0x3297 ||
    cp === 0x3299
  );
}

const isKeycapBase = (cp: number) => cp === 0x23 || cp === 0x2a || inRange(cp, 0x30, 0x39);

/** Recorre un texto por code points (los pares sustitutos cuentan como uno). */
function codePoints(text: string): number[] {
  const out: number[] = [];
  for (const ch of text) out.push(ch.codePointAt(0) as number);
  return out;
}

/**
 * ¿Es `text` exactamente un emoji (un solo grafema)? Reconoce: pictogramas (con VS16 y tono de piel),
 * secuencias ZWJ (👨‍👩‍👧‍👦), banderas por país (🇨🇷), banderas por etiquetas (🏴󠁧󠁢󠁥󠁮󠁧󠁿) y teclas (1️⃣).
 */
export function isSingleEmoji(text: string): boolean {
  if (!text || text.length > EMOJI_MAX_LENGTH * 2) return false;
  const cps = codePoints(text);
  if (cps.length === 0 || cps.length > EMOJI_MAX_LENGTH) return false;

  let i = 0;
  // Bandera por país: dos indicadores regionales.
  if (isRegionalIndicator(cps[0] as number)) {
    return cps.length === 2 && isRegionalIndicator(cps[1] as number);
  }
  // Tecla: [0-9#*] VS16? 20E3
  if (isKeycapBase(cps[0] as number)) {
    const rest = cps.slice(1);
    return (
      (rest.length === 1 && rest[0] === KEYCAP) ||
      (rest.length === 2 && rest[0] === VS16 && rest[1] === KEYCAP)
    );
  }

  // Elemento: pictograma + modificadores; los elementos se unen con ZWJ.
  let elements = 0;
  while (i < cps.length) {
    const base = cps[i] as number;
    if (!isPictographic(base)) return false;
    i += 1;
    elements += 1;
    while (i < cps.length) {
      const m = cps[i] as number;
      if (m === VS16 || isSkinTone(m)) i += 1;
      else if (isTagChar(m))
        i += 1; // banderas por etiquetas (Inglaterra, Escocia…)
      else break;
    }
    if (i < cps.length) {
      if (cps[i] !== ZWJ) return false;
      i += 1;
      if (i >= cps.length) return false; // ZWJ colgante
    }
  }
  return elements >= 1;
}

interface Segmenter {
  segment(input: string): Iterable<unknown>;
}

/** Cuenta grafemas con Intl.Segmenter cuando existe (Node, algunos motores); si no, null. */
export function countGraphemes(text: string): number | null {
  const Seg = (Intl as unknown as { Segmenter?: new (l?: string, o?: object) => Segmenter })
    .Segmenter;
  if (!Seg) return null;
  let n = 0;
  for (const _ of new Seg(undefined, { granularity: 'grapheme' }).segment(text)) {
    void _;
    n += 1;
  }
  return n;
}

/**
 * Validación completa para guardar un ícono: 1–16 caracteres, un solo grafema (Intl.Segmenter si
 * está disponible) y que sea un emoji reconocible.
 */
export function validateEmoji(text: string): boolean {
  if (typeof text !== 'string' || text.length === 0 || [...text].length > EMOJI_MAX_LENGTH) {
    return false;
  }
  const graphemes = countGraphemes(text);
  if (graphemes !== null && graphemes !== 1) return false;
  return isSingleEmoji(text);
}
