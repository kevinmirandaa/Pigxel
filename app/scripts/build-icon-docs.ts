/// <reference types="node" />
/**
 * Genera docs/fidelity-iconos.md: política, tamaños por contexto, mapa de reemplazo (SVG del Figma → Lucide) y
 * catálogo en uso. Uso: npm run docs:icons
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  ICON_REPLACEMENTS,
  addMenuTones,
  iconSize,
  iconStroke,
} from '../src/design-system/icons/iconTokens';

const root = join(__dirname, '..');
const src = readFileSync(join(root, 'src/design-system/icons/lucide.tsx'), 'utf8');
const names = [...src.matchAll(/^ {2}'?([a-z0-9-]+)'?: \w+,$/gm)].map((m) => m[1] as string);
const files = new Map(
  [...src.matchAll(/import (\w+) from 'lucide-react-native\/icons\/([\w-]+)';/g)].map((m) => [
    m[1] as string,
    m[2] as string,
  ]),
);
const aliases = [...src.matchAll(/^ {2}'?([a-z0-9-]+)'?: (\w+),$/gm)]
  .map((m) => ({ name: m[1] as string, file: files.get(m[2] as string) as string }))
  .filter((x) => x.name !== x.file);

const lines = [
  '# Iconografía unificada (Fase 7 · Etapa 0b)',
  '',
  'Generado por `npm run docs:icons` (`scripts/build-icon-docs.ts`) desde `icons/iconTokens.ts` y `icons/lucide.tsx`. No editar a mano.',
  '',
  '## Política',
  '- **Un solo sistema de íconos de línea:** `lucide-react-native`, importado ícono por ícono (`lucide-react-native/icons/<nombre>`), para que el bundle incluya solo los usados.',
  '- **Un solo componente:** `<Icon name size color strokeWidth />` (`primitives/Icon.tsx`). El nombre es del catálogo (`icons/lucide.tsx`) y está tipado.',
  `- **Trazo coherente:** ABSOLUTO, ${iconStroke.default} pt en toda la app (así lo dibuja el Figma, a cualquier tamaño); ${iconStroke.firm} pt en campos de auth y botones de vidrio (medido); ${iconStroke.large} pt en íconos grandes. Puntas y esquinas redondeadas (propias de Lucide).`,
  '- **Los emojis de usuario NO cambian** (texto del sistema) y **el logo de marca NO cambia**.',
  '- **Los SVG antiguos de `assets/icons/**` siguen en disco como respaldo, pero la app ya no los importa** (lo verifica una prueba unitaria). `icons/generated.tsx` y `scripts/build-icons.ts` quedan OBSOLETOS (sin importar).',
  '- La carita del disparador de emoji (`SmileGlyph`) conserva los trazos exactos del Figma (es del mismo estilo de línea).',
  '',
  '## Tamaños por contexto',
  '| Contexto | Tamaño (pt) |',
  '|---|---|',
  ...Object.entries(iconSize).map(([k, v]) => `| ${k} | ${v} |`),
  '',
  '## Mapa de reemplazo: SVG del Figma → Lucide',
  '| Ícono antiguo | Ícono actual |',
  '|---|---|',
  ...Object.entries(ICON_REPLACEMENTS).map(([o, n]) => `| \`${o}\` | \`${n}\` |`),
  '',
  '### Menú Agregar (de color)',
  `Mismos tonos que el Figma dentro del círculo de 50×50 (\`IconCircle\`): \`piggy-bank\` **${addMenuTones.piggy}**, \`notebook-text\` **${addMenuTones.note}**, \`credit-card\` **${addMenuTones.card}**, \`target\` **${addMenuTones.goal}** (medidos en los SVG originales).`,
  '',
  '### Barra de pestañas',
  '- Inactiva: línea gris `#C1C1C1`, trazo 2 pt. Activa: negro y más firme.',
  '- **Cartera** y **capas**: la forma cerrada va RELLENA en negro (la cartera con el cierre en punto blanco, como el ícono activo del Figma); las bandas inferiores de las capas, con trazo firme.',
  '- **Actividad**: tres barras con trazo grueso redondeado (3,25 pt) — Lucide solo trae contorno, y a ese grosor leen como barras sólidas.',
  '- **Desviación:** para Actividad se usa `chart-no-axes-column-increasing` (barras ascendentes, como el glifo del Figma) en lugar de `chart-no-axes-column` (la del medio más alta).',
  '- Aviso: las siluetas rellenas están construidas con los mismos trazos de Lucide, pero **no pude verlas renderizadas** (sin simulador): el cliente debe confirmarlas en la galería.',
  '',
  '## Alias de nombre en Lucide v1 (archivo ≠ nombre usado en el Figma)',
  ...aliases.map((a) => `- \`${a.name}\` → \`lucide-react-native/icons/${a.file}\``),
  '',
  `## Catálogo en uso (${names.length} íconos)`,
  names.map((n) => `\`${n}\``).join(' · '),
  '',
];
writeFileSync(join(root, 'docs/fidelity-iconos.md'), lines.join('\n'));
console.log(
  `docs/fidelity-iconos.md: ${names.length} íconos, ${Object.keys(ICON_REPLACEMENTS).length} reemplazos`,
);
