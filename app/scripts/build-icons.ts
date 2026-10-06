/// <reference types="node" />
/**
 * OBSOLETO (Fase 7 · 0b): la app ya no usa estos SVG; todos los íconos son Lucide (ver docs/fidelity-iconos.md).
 * Se conserva solo como referencia. Convierte los SVG monocromáticos de assets/icons/{tabs,ui,settings} en componentes de
 * react-native-svg con el color por prop (un solo SVG fuente por ícono: sin duplicar archivos para
 * estado activo/inactivo). Los íconos de color de assets/icons/add se quedan como SVG importados.
 * Uso: npm run build:icons  → src/design-system/icons/generated.tsx
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..');
const GROUPS = ['tabs', 'ui', 'settings'] as const;

const ATTR_MAP: Record<string, string> = {
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'fill-opacity': 'fillOpacity',
  'stroke-opacity': 'strokeOpacity',
  opacity: 'opacity',
  d: 'd',
  cx: 'cx',
  cy: 'cy',
  r: 'r',
  x: 'x',
  y: 'y',
  width: 'width',
  height: 'height',
  rx: 'rx',
  transform: 'transform',
};

const pascal = (s: string) =>
  s
    .split(/[-_/]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');

function convert(svg: string): { jsx: string; width: number; height: number; viewBox: string } {
  const head = svg.match(/<svg\b[^>]*>/)?.[0] ?? '';
  const viewBox = head.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 24 24';
  const width = Number(head.match(/\swidth="([\d.]+)"/)?.[1] ?? viewBox.split(' ')[2]);
  const height = Number(head.match(/\sheight="([\d.]+)"/)?.[1] ?? viewBox.split(' ')[3]);
  const body = svg.replace(/<svg\b[^>]*>/, '').replace(/<\/svg>/, '');

  const out: string[] = [];
  for (const m of body.matchAll(/<(\/?)(g|path|circle|rect|ellipse|line)\b([^>]*?)(\/?)>/g)) {
    const [, closing, tag, rawAttrs, selfClose] = m as unknown as [
      string,
      string,
      string,
      string,
      string,
    ];
    const el = tag.charAt(0).toUpperCase() + tag.slice(1);
    if (closing) {
      out.push(`</${el}>`);
      continue;
    }
    const props: string[] = [];
    for (const a of rawAttrs.matchAll(/([\w:-]+)="([^"]*)"/g)) {
      const [, name, value] = a as unknown as [string, string, string];
      if (name === 'id' || name === 'style' || name === 'xmlns') continue;
      if (name === 'fill' || name === 'stroke') {
        props.push(value === 'none' ? `${name}="none"` : `${name}={color}`);
      } else if (ATTR_MAP[name]) {
        props.push(`${ATTR_MAP[name]}="${value}"`);
      }
    }
    // Un <path> sin fill/stroke explícito pintaba en negro: se mantiene con el color del ícono.
    if (tag !== 'g' && !props.some((p) => p.startsWith('fill=') || p.startsWith('stroke=')))
      props.push('fill={color}');
    out.push(`<${el} ${props.join(' ')}${selfClose ? ' /' : ''}>`.replace(' >', '>'));
  }
  return { jsx: out.join('\n        '), width, height, viewBox };
}

const lines: string[] = [
  '/* eslint-disable */',
  '// OBSOLETO: ya no se importa. Los íconos de la app son Lucide (docs/fidelity-iconos.md). Generado por scripts/build-icons.ts.',
  "import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';",
  '',
  'export interface MonoIconProps {',
  '  /** Color del ícono (relleno/trazo). */',
  '  color?: string;',
  '  width?: number;',
  '  height?: number;',
  '}',
  '',
];
const map: string[] = [];
const sizes: string[] = [];

for (const group of GROUPS) {
  const dir = join(ROOT, 'assets/icons', group);
  for (const file of readdirSync(dir)
    .filter((f) => f.endsWith('.svg'))
    .sort()) {
    const key = `${group}/${file.replace('.svg', '')}`;
    const svg = readFileSync(join(dir, file), 'utf8');
    const { jsx, width, height, viewBox } = convert(svg);
    const name = `${pascal(group)}${pascal(file.replace('.svg', ''))}`;
    lines.push(
      `function ${name}({ color = '#000000', width = ${width}, height = ${height} }: MonoIconProps) {`,
      '  return (',
      `    <Svg width={width} height={height} viewBox="${viewBox}" fill="none">`,
      `        ${jsx}`,
      '    </Svg>',
      '  );',
      '}',
      '',
    );
    map.push(`  '${key}': ${name},`);
    sizes.push(`  '${key}': [${width}, ${height}],`);
  }
}
lines.push(
  'export const monoIcons = {',
  ...map,
  '} as const;',
  '',
  '/** Tamaño natural (ancho, alto) de cada ícono, en puntos, tal como sale de Figma. */',
  'export const monoIconSizes: Record<keyof typeof monoIcons, readonly [number, number]> = {',
  ...sizes,
  '};',
  '',
  'export type MonoIconName = keyof typeof monoIcons;',
  '',
);
writeFileSync(join(ROOT, 'src/design-system/icons/generated.tsx'), lines.join('\n'));
console.log(`generated.tsx: ${map.length} íconos`);
