import type { EmojiEntry } from './data';

/** Minúsculas y sin acentos: "cafe" encuentra "café". */
export const normalize = (text: string): string =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export interface IndexedEmoji extends EmojiEntry {
  hay: string;
  label: string;
}

export function buildIndex(catalog: readonly EmojiEntry[]): IndexedEmoji[] {
  return catalog.map((entry) => ({
    ...entry,
    label: normalize(entry.l),
    hay: normalize(`${entry.l} ${entry.t.join(' ')}`),
  }));
}

/** Filtra por versión de Emoji que el sistema puede dibujar. */
export function supportedOnly<T extends { v: number }>(
  items: readonly T[],
  maxVersion: number,
): T[] {
  return items.filter((item) => item.v <= maxVersion);
}

/**
 * Busca por nombre y palabras clave (todas las palabras de la consulta deben aparecer).
 * Primero los que empiezan con la consulta, luego el resto en el orden del catálogo.
 */
export function searchEmojis(
  index: readonly IndexedEmoji[],
  query: string,
  maxVersion: number,
): IndexedEmoji[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const hits = index.filter(
    (item) => item.v <= maxVersion && words.every((word) => item.hay.includes(word)),
  );
  const first = words[0] as string;
  return [
    ...hits.filter((item) => item.label.startsWith(first)),
    ...hits.filter((item) => !item.label.startsWith(first)),
  ];
}
