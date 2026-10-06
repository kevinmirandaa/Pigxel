import raw from './emoji-data.json';

/** Un emoji del catálogo (generado por scripts/build-emoji-data.ts, etiquetas en español). */
export interface EmojiEntry {
  /** El emoji como texto Unicode. */
  e: string;
  /** Nombre en español. */
  l: string;
  /** Palabras clave en español. */
  t: string[];
  /** Índice de grupo. */
  g: number;
  /** Versión de Emoji en que apareció (p. ej. 13.1). */
  v: number;
}

export interface EmojiGroup {
  key: string;
  label: string;
}

export const emojiGroups = raw.groups as EmojiGroup[];
export const emojiCatalog = raw.emojis as EmojiEntry[];

/** Emoji representativo de cada grupo para la barra de categorías (mismo orden que `emojiGroups`). */
export const GROUP_ICONS = ['😀', '👋', '🐻', '🍔', '✈️', '⚽', '💡', '🔣', '🏁'] as const;
