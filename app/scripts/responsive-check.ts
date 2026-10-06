/// <reference types="node" />
/**
 * Verificación indirecta del ancho responsivo (no hay simulador): calcula, con las MISMAS funciones puras
 * que define `design-system/tokens/metrics.ts`, el ancho que ocupa cada componente a 360/375/390/402/430 (y 768 = iPad)
 * y el sobrante lateral (0 = ocupa exactamente el contenido; negativo = se desborda).
 * Uso: npm run responsive-check  → docs/responsive-check.md (falla si algún componente se desborda).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import * as m from '../src/design-system/tokens/metrics';

const WIDTHS = [360, 375, 390, 402, 430, 768] as const;
const f = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
const cw = (w: number, margin: number = m.SCREEN_MARGIN) => m.contentWidth(w, margin);

interface Row {
  component: string;
  rule: string;
  /** Ancho que ocupa el componente en `w`. */
  width: (w: number) => number;
  /** Ancho máximo permitido (contenido del contenedor). */
  limit: (w: number) => number;
}

const rows: Row[] = [
  {
    component: 'Contenido estándar (margen 36)',
    rule: 'columna − 72',
    width: (w) => cw(w),
    limit: (w) => cw(w),
  },
  {
    component: 'Card / ListRow (alto 74)',
    rule: 'se estira (stretch)',
    width: (w) => cw(w),
    limit: (w) => cw(w),
  },
  {
    component: 'SettingsGroup (detalle)',
    rule: 'se estira',
    width: (w) => cw(w),
    limit: (w) => cw(w),
  },
  {
    component: 'SettingsGroup (menú, margen 39)',
    rule: 'columna − 78',
    width: (w) => cw(w, m.SETTINGS_MENU_MARGIN),
    limit: (w) => cw(w, m.SETTINGS_MENU_MARGIN),
  },
  { component: 'PillInput (alto 60)', rule: 'se estira', width: (w) => cw(w), limit: (w) => cw(w) },
  {
    component: 'SearchField (alto 53)',
    rule: 'se estira',
    width: (w) => cw(w),
    limit: (w) => cw(w),
  },
  {
    component: 'PrimaryButton (alto 60)',
    rule: 'se estira',
    width: (w) => cw(w),
    limit: (w) => cw(w),
  },
  {
    component: 'PrimaryButton de bienvenida (margen 51)',
    rule: 'columna − 102',
    width: (w) => cw(w, m.WELCOME_MARGIN),
    limit: (w) => cw(w, m.WELCOME_MARGIN),
  },
  { component: 'InfoNote', rule: 'se estira', width: (w) => cw(w), limit: (w) => cw(w) },
  { component: 'ProgressBar', rule: 'se estira', width: (w) => cw(w), limit: (w) => cw(w) },
  {
    component: 'Segmented (máx. 252,5)',
    rule: 'min(contenido, 252,5)',
    width: (w) => m.segmentedWidth(cw(w)),
    limit: (w) => cw(w),
  },
  {
    component: 'TabsUnderline (2 × 115)',
    rule: 'fijo, centrado',
    width: () => 230,
    limit: (w) => cw(w),
  },
  {
    component: 'LineChart (ancho por onLayout)',
    rule: 'se estira',
    width: (w) => cw(w),
    limit: (w) => cw(w),
  },
  {
    component: 'OtpInput (bloque, margen +6)',
    rule: 'contenido − 12',
    width: (w) => m.otpBlockWidth(w),
    limit: (w) => cw(w),
  },
  {
    component: 'EmptyState (texto máx. 266)',
    rule: 'min(contenido, 266)',
    width: (w) => Math.min(cw(w), 266),
    limit: (w) => cw(w),
  },
  {
    component: 'FloatingTabBar (249, centrada)',
    rule: 'fijo, centrado en la pantalla',
    width: () => 249,
    limit: (w) => m.columnWidth(w),
  },
];

const failures: string[] = [];
const out: string[] = [
  '# Verificación de ancho responsivo',
  '',
  'Generado por `npm run responsive-check` (`scripts/responsive-check.ts`). No editar a mano.',
  'Usa las mismas funciones puras que el layout (`design-system/tokens/metrics.ts`, cubiertas por `npm run test:unit`).',
  '',
  '**Modelo:** márgenes laterales FIJOS (36 pt; 51 en los botones de bienvenida; 39 en el menú de Ajustes) y contenido FLEXIBLE:',
  '`ancho de contenido = min(ancho de pantalla, 440) − 2 × margen`. En iPad (768) la app es una columna de 440 pt centrada.',
  '',
  '## 1. Ancho que ocupa cada componente (pt) y sobrante',
  '',
  'Cada celda: `ancho (sobra N)`. **Sobra 0** = ocupa exactamente el ancho disponible; un valor negativo sería un desborde.',
  '',
  `| Componente | Regla | ${WIDTHS.join(' | ')} |`,
  `|---|---|${WIDTHS.map(() => '---').join('|')}|`,
];
for (const r of rows) {
  const cells = WIDTHS.map((w) => {
    const width = r.width(w);
    const sobra = r.limit(w) - width;
    if (sobra < -1e-9) failures.push(`${r.component} a ${w} pt: sobra ${sobra}`);
    return `${f(width)} (sobra ${f(sobra)})`;
  });
  out.push(`| ${r.component} | ${r.rule} | ${cells.join(' | ')} |`);
}

out.push(
  '',
  '## 2. Medidas derivadas',
  '',
  `| Medida | ${WIDTHS.join(' | ')} |`,
  `|---|${WIDTHS.map(() => '---').join('|')}|`,
  `| Ancho de la columna de la app | ${WIDTHS.map((w) => f(m.columnWidth(w))).join(' | ')} |`,
  `| Casilla OTP (6 + 5 espacios de 5,4) | ${WIDTHS.map((w) => f(m.otpCellWidth(m.otpBlockWidth(w)))).join(' | ')} |`,
  `| Margen izquierdo del tab bar (249 centrado) | ${WIDTHS.map((w) => f(m.centeredLeft(w, 249))).join(' | ')} |`,
  `| Espacio de texto en una fila (junto a emoji y monto) | ${WIDTHS.map((w) => f(m.rowTextWidth(cw(w)))).join(' | ')} |`,
  `| Paso entre días en la gráfica (7 puntos, 22 pt de relleno) | ${WIDTHS.map((w) => f((cw(w) - 44) / 6)).join(' | ')} |`,
  `| Botones de vidrio en una fila (3 × 50 + 2 espacios de 12) | ${WIDTHS.map(() => '174').join(' | ')} (cabe en todos) |`,
  '',
  '## 3. Comparación con el problema original (ancho fijo del Figma)',
  '',
  'Antes los componentes usaban `width: 330` (tarjetas, campos), `351` (buscador) y `300` (botones): a menos de 402 pt se salían.',
  '',
  `| Ancho fijo antiguo | ${WIDTHS.join(' | ')} |`,
  `|---|${WIDTHS.map(() => '---').join('|')}|`,
  ...[330, 351, 300].map(
    (fixed) =>
      `| ${fixed} pt | ${WIDTHS.map((w) => {
        const margin = fixed === 300 ? m.WELCOME_MARGIN : m.SCREEN_MARGIN;
        const over = m.overflow(w, fixed, margin);
        return over < 0 ? `**se desborda ${f(-over)}**` : `sobra ${f(over)}`;
      }).join(' | ')} |`,
  ),
  '',
  failures.length === 0
    ? '**Resultado:** ningún componente se desborda en ningún ancho (360 → 768).'
    : `**FALLOS (${failures.length}):**\n${failures.map((x) => `- ${x}`).join('\n')}`,
  '',
);

mkdirSync(join(__dirname, '../docs'), { recursive: true });
writeFileSync(join(__dirname, '../docs/responsive-check.md'), out.join('\n'));
console.log(
  failures.length === 0
    ? '✅ docs/responsive-check.md: sin desbordes'
    : `❌ ${failures.length} desbordes`,
);
process.exit(failures.length === 0 ? 0 : 1);
