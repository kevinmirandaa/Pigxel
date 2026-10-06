/// <reference types="node" />
/**
 * Genera src/design-system/emoji/emoji-data.json desde emojibase-data (MIT, Emoji 17, español).
 * Uso: npm run build:emoji-data  (solo hace falta al actualizar emojibase-data).
 * Quita componentes (tonos de piel sueltos), indicadores regionales y variantes de tono.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkgRoot = require.resolve('emojibase-data/package.json').replace(/package\.json$/, '');
const read = <T>(path: string): T => JSON.parse(readFileSync(pkgRoot + path, 'utf8')) as T;

interface Compact {
  hexcode: string;
  label: string;
  tags?: string[];
  group?: number;
  order?: number;
  unicode: string;
}
interface Messages {
  groups: { key: string; message: string; order: number }[];
}

const compact = read<Compact[]>('es/compact.json');
const messages = read<Messages>('es/messages.json');
const versionsByNumber = read<Record<string, string[]>>('versions/emoji.json');

const versionOf = new Map<string, number>();
for (const [version, hexcodes] of Object.entries(versionsByNumber)) {
  for (const hex of hexcodes) versionOf.set(hex, Number.parseFloat(version));
}

const COMPONENT_GROUP = 2;
const groupOrder = messages.groups.filter((g) => g.order !== COMPONENT_GROUP);
const groupIndex = new Map(groupOrder.map((g, i) => [g.order, i]));

const emojis = compact
  .filter((e) => e.group !== undefined && e.group !== COMPONENT_GROUP)
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  .map((e) => ({
    e: e.unicode,
    l: e.label,
    t: e.tags ?? [],
    g: groupIndex.get(e.group as number) as number,
    v: versionOf.get(e.hexcode) ?? 0,
  }));

const missing = emojis.filter((e) => e.v === 0).length;
const out = {
  groups: groupOrder.map((g) => ({ key: g.key, label: g.message })),
  emojis,
};
writeFileSync(
  new URL('../src/design-system/emoji/emoji-data.json', import.meta.url),
  `${JSON.stringify(out)}\n`,
);
console.log(`emojis: ${emojis.length} · grupos: ${out.groups.length} · sin versión: ${missing}`);
