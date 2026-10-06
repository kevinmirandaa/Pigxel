/// <reference types="node" />
/**
 * Extrae medidas y colores de los diseños de Figma y genera docs/measurements.md (+ .json).
 *   · Medidas: design-spec/figma-metadata.xml (tamaños y posiciones por capa).
 *   · Colores, radios y tamaños de fuente que NO están en el XML: se MUESTREAN de
 *     design-spec/screens/*.png (3x) con pngjs.
 * Uso: npm run measure   (solo lectura sobre design-spec/; escribe en docs/)
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { SCREEN_IDS, parseFigmaXml, walk, type FigmaNode } from './lib/figma-xml';
import { Shot, fromHex, toHex, type Box } from './lib/png-sample';

const SPEC = join(__dirname, '../../design-spec');
const DOCS = join(__dirname, '../docs');
const frames = parseFigmaXml(join(SPEC, 'figma-metadata.xml'));
const byName = new Map(frames.map((f) => [SCREEN_IDS[f.id] ?? f.name, f]));

const BG = fromHex('#F4F4F4');
const WHITE = fromHex('#FFFFFF');
/** Relación altura de mayúscula / tamaño de fuente de SF Pro Rounded, calibrada con títulos de 32 pt. */
const CAP_RATIO = 0.724;

const round = (n: number, d = 1) => Number(n.toFixed(d));
const dim = (n: FigmaNode) => `${round(n.width)}×${round(n.height)}`;
const box = (n: FigmaNode): Box => ({ ax: n.ax, ay: n.ay, width: n.width, height: n.height });

function nodes(screen: string): FigmaNode[] {
  const f = byName.get(screen);
  if (!f) throw new Error(`Pantalla desconocida: ${screen}`);
  return [...walk(f)].filter((n) => n !== f);
}
function find(screen: string, pred: (n: FigmaNode) => boolean, nth = 0): FigmaNode {
  const hit = nodes(screen).filter(pred)[nth];
  if (!hit) throw new Error(`No encontré el nodo en ${screen} (nth=${nth})`);
  return hit;
}
const named = (name: string) => (n: FigmaNode) => n.name === name;
const sized = (name: string, w: number, h: number) => (n: FigmaNode) =>
  n.name === name && Math.abs(n.width - w) < 0.6 && Math.abs(n.height - h) < 0.6;
const shot = (screen: string) => Shot.screen(SPEC, screen);
const inside = (b: Box, dx = 0, dy = 0): [number, number] => [
  b.ax + b.width / 2 + dx,
  b.ay + b.height / 2 + dy,
];

const out: string[] = [];
const json: Record<string, unknown> = {};
const section = (title: string, intro?: string) =>
  out.push(`\n## ${title}\n`, ...(intro ? [intro, ''] : []));
const table = (head: string[], rows: (string | number)[][]) => {
  out.push(`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`);
  for (const r of rows) out.push(`| ${r.join(' | ')} |`);
  out.push('');
};

// ───────────────────────── 1. MEDIDAS (XML) ─────────────────────────
section(
  '1. Medidas observadas (figma-metadata.xml)',
  'Posiciones relativas al frame de la pantalla (402 × 874). `×N` = cuántas veces aparece en ese frame.',
);

interface Probe {
  component: string;
  screen: string;
  pred: (n: FigmaNode) => boolean;
  limit?: number;
}
const probes: Probe[] = [
  {
    component: 'Botón de vidrio · símbolo (pestañas)',
    screen: 'tab-cuentas-objetivos',
    pred: named('Button - Liquid Glass - Symbol'),
  },
  {
    component: 'Botón de vidrio · atrás',
    screen: 'add-categoria',
    pred: named('Button - Liquid Glass - Symbol'),
  },
  {
    component: 'Botón de vidrio · Volver (detalle)',
    screen: 'ajustes-ayuda',
    pred: named('Volver'),
  },
  {
    component: 'Botón de vidrio · Crear "+" (detalle)',
    screen: 'ajustes-objetivos',
    pred: named('Crear'),
  },
  { component: 'Título de pantalla (detalle)', screen: 'ajustes-limite', pred: named('Título') },
  {
    component: 'Título de pantalla (Agregar/Nueva…)',
    screen: 'add-cuenta',
    pred: (n) => n.tag === 'text' && n.ay === 98,
  },
  {
    component: 'Título de pestaña (Actividad)',
    screen: 'tab-actividad',
    pred: (n) => n.tag === 'text' && n.name === 'Actividad',
  },
  {
    component: 'Título de pestaña (Pigxel)',
    screen: 'tab-cuentas-objetivos',
    pred: (n) => n.tag === 'text' && n.name === 'Pigxel',
  },
  {
    component: 'Saldo grande (64)',
    screen: 'tab-cuentas-objetivos',
    pred: (n) => n.tag === 'text' && n.name === '¢ 830.000',
  },
  {
    component: 'Etiqueta "Saldo total"',
    screen: 'tab-cuentas-objetivos',
    pred: (n) => n.tag === 'text' && n.name === 'Saldo total',
  },
  {
    component: 'Tarjeta de fila 330×74 (Agregar)',
    screen: 'add-menu',
    pred: (n) =>
      n.tag === 'rounded-rectangle' && Math.abs(n.width - 330) < 1 && Math.abs(n.height - 74) < 1,
    limit: 4,
  },
  {
    component: 'Tarjeta de fila 330×74 (Actividad)',
    screen: 'tab-actividad',
    pred: (n) =>
      n.tag === 'rounded-rectangle' && Math.abs(n.width - 330) < 1 && Math.abs(n.height - 74) < 1,
    limit: 4,
  },
  {
    component: 'Tarjeta de fila 330×74 (Objetivos)',
    screen: 'tab-cuentas-objetivos',
    pred: (n) =>
      n.tag === 'rounded-rectangle' && Math.abs(n.width - 330) < 1 && Math.abs(n.height - 74) < 1,
    limit: 2,
  },
  {
    component: 'Emoji de fila 35×35',
    screen: 'tab-actividad',
    pred: (n) => n.tag === 'rounded-rectangle' && n.width === 35,
    limit: 4,
  },
  {
    component: 'Campo en píldora (fondo + trazo)',
    screen: 'auth-iniciar-sesion',
    pred: (n) => n.tag === 'rounded-rectangle' && n.width === 330 && n.height === 60,
  },
  {
    component: 'Campo en píldora (Agregar)',
    screen: 'add-cuenta',
    pred: (n) => n.tag === 'rounded-rectangle' && n.width === 330 && n.height === 60,
  },
  { component: 'Botón negro con flecha', screen: 'add-categoria', pred: named('Rectangle 3') },
  {
    component: 'Botón negro con flecha (flecha)',
    screen: 'add-categoria',
    pred: (n) => n.tag === 'vector' && n.ay > 400,
  },
  {
    component: 'Control segmentado (contenedor)',
    screen: 'tab-actividad',
    pred: named('Rectangle 17'),
  },
  {
    component: 'Control segmentado (activa)',
    screen: 'tab-actividad',
    pred: named('Rectangle 18'),
  },
  {
    component: 'Control segmentado · etiquetas',
    screen: 'tab-actividad',
    pred: (n) => n.tag === 'text' && n.ay === 113,
  },
  { component: 'Buscador', screen: 'tab-actividad', pred: named('Rectangle 25') },
  {
    component: 'Subrayado de pestañas (Cuentas/Objetivos)',
    screen: 'tab-cuentas-objetivos',
    pred: (n) => n.tag === 'line',
  },
  {
    component: 'Pestañas Cuentas / Objetivos (texto)',
    screen: 'tab-cuentas-objetivos',
    pred: (n) => n.tag === 'text' && n.ay === 352,
  },
  {
    component: 'Círculo disparador de emoji',
    screen: 'add-categoria',
    pred: named('Rectangle 15'),
  },
  {
    component: 'Círculo del emoji (glifo)',
    screen: 'add-categoria',
    pred: (n) => n.name === 'Group',
  },
  {
    component: 'Ícono de encabezado (detalle)',
    screen: 'ajustes-ayuda',
    pred: sized('Icono', 56, 56),
  },
  {
    component: 'Descripción bajo el ícono (detalle)',
    screen: 'ajustes-ayuda',
    pred: named('Descripción'),
  },
  { component: 'Tarjeta de ajustes (detalle)', screen: 'ajustes-ayuda', pred: named('Tarjeta') },
  {
    component: 'Fila de ajustes (detalle · con ícono)',
    screen: 'ajustes-ayuda',
    pred: (n) => n.name === 'Opción',
    limit: 3,
  },
  {
    component: 'Ícono en caja de la fila (detalle)',
    screen: 'ajustes-ayuda',
    pred: sized('Icono', 44, 44),
    limit: 2,
  },
  {
    component: 'Chevron de fila (detalle)',
    screen: 'ajustes-ayuda',
    pred: named('chevron-right'),
    limit: 1,
  },
  {
    component: 'Divisor de fila con ícono',
    screen: 'ajustes-ayuda',
    pred: named('Divisor'),
    limit: 2,
  },
  {
    component: 'Divisor de fila sin ícono',
    screen: 'ajustes-moneda',
    pred: named('Divisor'),
    limit: 2,
  },
  {
    component: 'Fila de ajustes con interruptor',
    screen: 'ajustes-notificaciones',
    pred: (n) => n.name === 'Opción',
    limit: 2,
  },
  { component: 'Interruptor (encendido)', screen: 'ajustes-limite', pred: named('Activado') },
  { component: 'Interruptor (perilla)', screen: 'ajustes-limite', pred: named('Control') },
  {
    component: 'Interruptor (apagado)',
    screen: 'ajustes-notificaciones',
    pred: named('Desactivado'),
    limit: 1,
  },
  {
    component: 'Campo de información (detalle)',
    screen: 'ajustes-informacion-personal',
    pred: (n) => n.name === 'Campo',
    limit: 2,
  },
  {
    component: 'Texto del campo (etiqueta + valor)',
    screen: 'ajustes-informacion-personal',
    pred: (n) => n.name === 'Texto',
    limit: 1,
  },
  {
    component: 'Caja informativa (Límite)',
    screen: 'ajustes-limite',
    pred: named('Aviso de límite'),
  },
  { component: 'Caja informativa · ícono', screen: 'ajustes-limite', pred: named('info') },
  {
    component: 'Caja informativa · texto',
    screen: 'ajustes-limite',
    pred: (n) => n.name === 'Descripción' && n.width === 270,
  },
  {
    component: 'Objetivo (tarjeta)',
    screen: 'ajustes-objetivos',
    pred: named('Objetivo'),
    limit: 1,
  },
  {
    component: 'Objetivo · barra (pista)',
    screen: 'ajustes-objetivos',
    pred: named('Barra'),
    limit: 2,
  },
  {
    component: 'Objetivo · barra (avance)',
    screen: 'ajustes-objetivos',
    pred: named('Avance'),
    limit: 2,
  },
  {
    component: 'Objetivo · porcentaje',
    screen: 'ajustes-objetivos',
    pred: named('Porcentaje'),
    limit: 1,
  },
  {
    component: 'Código OTP · casilla visible',
    screen: 'auth-codigo-verificacion',
    pred: named('Rectangle 15'),
  },
  {
    component: 'Código OTP · cursor',
    screen: 'auth-codigo-verificacion',
    pred: (n) => n.tag === 'text' && n.name === 'l',
  },
  {
    component: 'Código OTP · texto de reenvío',
    screen: 'auth-codigo-verificacion',
    pred: (n) => n.tag === 'text' && n.name.startsWith('¿No recibiste'),
  },
  { component: 'Estado vacío · ícono', screen: 'notificaciones', pred: named('Group') },
  { component: 'Estado vacío · texto', screen: 'notificaciones', pred: named('Información') },
  {
    component: 'Gráfica de línea (imagen)',
    screen: 'tab-actividad',
    pred: (n) => n.name.startsWith('Screenshot'),
  },
  {
    component: 'Tab bar (flotante, pantallas de detalle)',
    screen: 'ajustes-ayuda',
    pred: named('Barra inferior'),
  },
  {
    component: 'Tab bar · fondo de vidrio',
    screen: 'ajustes-ayuda',
    pred: named('Fondo Liquid Glass'),
  },
  {
    component: 'Tab bar · pestaña seleccionada',
    screen: 'ajustes-ayuda',
    pred: named('Ajustes seleccionado'),
  },
  { component: 'Tab bar · ícono Wallet', screen: 'ajustes-ayuda', pred: named('Wallet') },
  { component: 'Tab bar · ícono Actividad', screen: 'ajustes-ayuda', pred: named('Actividad') },
  { component: 'Tab bar · ícono Ajustes', screen: 'ajustes-ayuda', pred: named('Ajustes') },
  {
    component: 'Fila de ajustes principal (caja 50)',
    screen: 'tab-ajustes',
    pred: (n) => n.name === 'Rectangle 48' && n.width === 50,
    limit: 2,
  },
];

const measureRows: (string | number)[][] = [];
const jsonMeasures: Record<string, unknown> = {};
for (const p of probes) {
  const hits = nodes(p.screen)
    .filter(p.pred)
    .slice(0, p.limit ?? 1);
  if (hits.length === 0) {
    measureRows.push([p.component, p.screen, '—', '—', '—']);
    continue;
  }
  hits.forEach((n, i) => {
    measureRows.push([
      i === 0 ? p.component : '↳',
      p.screen,
      `"${n.name}"`,
      dim(n),
      `(${round(n.ax)}, ${round(n.ay)})`,
    ]);
  });
  jsonMeasures[p.component] = hits.map((n) => ({
    screen: p.screen,
    name: n.name,
    w: n.width,
    h: n.height,
    x: n.ax,
    y: n.ay,
  }));
}
table(['Componente', 'Pantalla', 'Capa', 'Ancho×Alto', 'Posición (x, y)'], measureRows);
json.measures = jsonMeasures;

// Pasos verticales entre tarjetas (el "gap" no es el mismo en todas las pantallas).
section(
  '1.1 Separación vertical entre tarjetas de fila',
  'Distancia entre el borde inferior de una tarjeta y el superior de la siguiente (puntos).',
);
const pitch: (string | number)[][] = [];
for (const screen of [
  'tab-cuentas',
  'tab-cuentas-objetivos',
  'tab-actividad',
  'add-menu',
  'add-lista-cuentas',
  'add-lista-categorias',
]) {
  const cards = nodes(screen)
    .filter(
      (n) =>
        n.tag === 'rounded-rectangle' && Math.abs(n.width - 330) < 1 && Math.abs(n.height - 74) < 1,
    )
    .sort((a, b) => a.ay - b.ay);
  const ys = [...new Set(cards.map((c) => c.ay))];
  const gaps = ys.slice(1).map((y, i) => round(y - (ys[i] as number) - 74));
  pitch.push([screen, ys.join(', '), gaps.join(', ') || '—']);
}
table(['Pantalla', 'y de cada tarjeta', 'gap entre tarjetas'], pitch);

// ───────────────────────── 2. COLORES / RADIOS / TIPOS (PNG) ─────────────────────────
section(
  '2. Muestreo de capturas (design-spec/screens/*.png a 3x)',
  'Colores = píxel exacto del relleno/trazo, o promedio del 15 % de píxeles de tinta más oscuros. Radios = medidos en la esquina (solo fiables con contraste alto).',
);

interface Sample {
  token: string;
  value: string;
  how: string;
}
const samples: Sample[] = [];
const add = (token: string, value: string | number | null, how: string) =>
  samples.push({ token, value: String(value ?? 'n/d'), how });

// Tarjeta de fila
{
  const n = find(
    'add-menu',
    (x) => x.tag === 'rounded-rectangle' && x.width === 330 && x.height === 74,
  );
  const s = shot('add-menu');
  const [cx, cy] = inside(box(n));
  add('card.fill', s.hex(cx, cy), 'add-menu · centro de la tarjeta 330×74');
  add(
    'card.border',
    s.hex(n.ax - 0.5, cy),
    'add-menu · borde: 1 pt FUERA del relleno (trazo exterior)',
  );
  add('card.borderWidth', 1, 'add-menu · escaneo de borde (3 px a 3x)');
  add(
    'card.radius',
    20,
    'get_design_context (rounded-[20px]); el muestreo da ≈17 por bajo contraste',
  );
}
// Campos en píldora (auth: fondo de pantalla BLANCO; formularios Agregar: fondo gris)
{
  const auth = shot('auth-recuperar-contrasena');
  const f = find(
    'auth-recuperar-contrasena',
    (x) => x.tag === 'rounded-rectangle' && x.width === 330 && x.height === 60 && x.ay < 400,
  );
  const right = (b: FigmaNode) => [b.ax + b.width - 14, b.ay + b.height / 2] as const;
  add(
    'screen.auth.bg',
    auth.hex(5, 5),
    'auth-recuperar-contrasena · fondo de pantalla (las pantallas de auth son BLANCAS)',
  );
  add(
    'field.auth.fill',
    auth.hex(...right(f)),
    'auth-recuperar-contrasena · campo (extremo derecho, sin texto)',
  );
  add(
    'field.auth.border',
    auth.hex(f.ax - 0.5, f.ay + f.height / 2),
    'auth-recuperar-contrasena · borde (exterior)',
  );
  add(
    'field.auth.radius',
    round(auth.cornerRadius(box(f), WHITE) ?? 0),
    'auth-recuperar-contrasena · esquina (≈ alto/2 = pastilla)',
  );
  const ico = find('auth-iniciar-sesion', (x) => x.name === 'mail');
  const authLogin = shot('auth-iniciar-sesion');
  add(
    'field.icon.color',
    authLogin.inkColor(box(ico), fromHex(auth.hex(...right(f)))),
    'auth-iniciar-sesion · ícono del campo',
  );
  add(
    'field.icon.size',
    `${ico.width}×${ico.height} @ x=${round(ico.ax)}`,
    'auth-iniciar-sesion · mail 20×20',
  );
  const add1 = shot('add-cuenta');
  const g = find('add-cuenta', (x) => x.name === 'Rectangle 7');
  add('field.form.fill', add1.hex(...right(g)), 'add-cuenta · campo blanco (extremo derecho)');
  add(
    'field.form.border',
    add1.hex(g.ax - 0.5, g.ay + g.height / 2),
    'add-cuenta · borde (exterior)',
  );
  add('field.form.radius', round(add1.cornerRadius(box(g), BG) ?? 0), 'add-cuenta · esquina');
  const ph = find('add-cuenta', (x) => x.tag === 'text' && x.name === 'Nombre');
  add(
    'field.placeholder.color',
    add1.inkColor(box(ph), WHITE),
    'add-cuenta · placeholder "Nombre"',
  );
  add(
    'field.placeholder.size',
    round((add1.firstGlyphHeight(box(ph), WHITE) ?? 0) / CAP_RATIO),
    'add-cuenta · altura de "N" / 0,724',
  );
  const ph2 = find(
    'auth-recuperar-contrasena',
    (x) => x.tag === 'text' && x.name === 'Correo electrónico',
  );
  add(
    'field.auth.placeholder.color',
    auth.inkColor(box(ph2), fromHex(auth.hex(...right(f)))),
    'auth-recuperar-contrasena · placeholder',
  );
}
// Botón negro
{
  const s = shot('add-categoria');
  const b = find('add-categoria', named('Rectangle 3'));
  const [bx, by] = inside(b as FigmaNode, -100, 0);
  add('primaryButton.fill', s.hex(bx, by), 'add-categoria · botón negro');
  add(
    'primaryButton.radius',
    round(s.cornerRadius(box(b), BG) ?? 0),
    'add-categoria · esquina (alto 60 → 30)',
  );
  const t = find('add-categoria', (x) => x.tag === 'text' && x.name === 'Crear');
  add(
    'primaryButton.text.color',
    s.inkColor(box(t), fromHex(s.hex(bx, by))),
    'add-categoria · texto "Crear"',
  );
  add(
    'primaryButton.text.size',
    round((s.firstGlyphHeight(box(t), fromHex(s.hex(bx, by))) ?? 0) / CAP_RATIO),
    'add-categoria · altura de "C" / 0,724',
  );
}
// Segmentado + buscador
{
  const s = shot('tab-actividad');
  const c = find('tab-actividad', named('Rectangle 17'));
  const a = find('tab-actividad', named('Rectangle 18'));
  add(
    'segmented.fill',
    s.hex(c.ax + c.width - 20, c.ay + c.height / 2),
    'tab-actividad · contenedor (zona derecha, sin la activa)',
  );
  add(
    'segmented.border',
    s.hex(c.ax - 0.5, c.ay + c.height / 2),
    'tab-actividad · borde (exterior)',
  );
  add(
    'segmented.active.fill',
    s.hex(a.ax + 8, a.ay + a.height / 2 + 12),
    'tab-actividad · pestaña activa',
  );
  add('segmented.radius', round(s.cornerRadius(box(c), BG) ?? 0), 'tab-actividad · esquina');
  const lblA = find('tab-actividad', (x) => x.tag === 'text' && x.ay === 113, 0);
  const lblI = find('tab-actividad', (x) => x.tag === 'text' && x.ay === 113, 1);
  add('segmented.label.active', s.inkColor(box(lblA), WHITE), 'tab-actividad · "Gastos"');
  add(
    'segmented.label.inactive',
    s.inkColor(box(lblI), fromHex(s.hex(c.ax + c.width - 20, c.ay + c.height / 2))),
    'tab-actividad · "Ingresos"',
  );
  add(
    'segmented.label.size',
    round((s.firstGlyphHeight(box(lblA), WHITE) ?? 0) / CAP_RATIO),
    'tab-actividad · altura de "G" / 0,724',
  );
  const q = find('tab-actividad', named('Rectangle 25'));
  add('search.fill', s.hex(q.ax + q.width - 30, q.ay + q.height / 2), 'tab-actividad · buscador');
  add('search.border', s.hex(q.ax - 0.5, q.ay + q.height / 2), 'tab-actividad · borde (exterior)');
}
// Círculo del emoji
{
  const s = shot('add-categoria');
  const c = find('add-categoria', named('Rectangle 15'));
  add('emojiCircle.size', `${c.width}×${c.height}`, 'add-categoria · Rectangle 15');
  add('emojiCircle.fill', s.hex(c.ax + 6, c.ay + c.height / 2), 'add-categoria · relleno');
  add('emojiCircle.border', s.hex(c.ax - 0.5, c.ay + c.height / 2), 'add-categoria · borde');
  const glyph = find('add-categoria', named('Group'));
  add('emojiCircle.glyph.color', s.inkColor(box(glyph), WHITE), 'add-categoria · carita');
  add(
    'emojiCircle.glyph.size',
    `${round(glyph.width)}×${round(glyph.height)}`,
    'add-categoria · Group',
  );
  const d = shot('ajustes-ayuda');
  const ic = find('ajustes-ayuda', sized('Icono', 56, 56));
  add(
    'headerIcon.fill',
    d.hex(ic.ax + 3, ic.ay + ic.height / 2),
    'ajustes-ayuda · caja 56×56 del encabezado',
  );
  add(
    'headerIcon.radius',
    round(d.cornerRadius(box(ic), BG) ?? 0),
    'ajustes-ayuda · esquina (aprox.)',
  );
  const rowIcon = find('ajustes-ayuda', sized('Icono', 44, 44));
  add(
    'rowIcon.fill',
    d.hex(rowIcon.ax + 3, rowIcon.ay + rowIcon.height / 2),
    'ajustes-ayuda · caja 44×44 de la fila',
  );
}
// Detalle: textos y divisor
{
  const d = shot('ajustes-ayuda');
  const title = find('ajustes-ayuda', named('Título'));
  const desc = find('ajustes-ayuda', named('Descripción'));
  const lab = find('ajustes-ayuda', (x) => x.tag === 'text' && x.name === 'Etiqueta');
  const det = find('ajustes-ayuda', (x) => x.tag === 'text' && x.name === 'Detalle');
  add('detail.title.color', d.inkColor(box(title), BG), 'ajustes-ayuda · "Ayuda"');
  const mon = shot('ajustes-moneda');
  const monTitle = find('ajustes-moneda', named('Título'));
  add(
    'detail.title.size',
    round((mon.firstGlyphHeight(monTitle, BG) ?? 0) / CAP_RATIO),
    'ajustes-moneda · altura de "M" de "Moneda" / 0,724',
  );
  const lim = shot('ajustes-limite');
  const limTitle = find('ajustes-limite', named('Título'));
  add(
    'detail.title.size.check',
    round((lim.firstGlyphHeight(limTitle, BG) ?? 0) / CAP_RATIO),
    'ajustes-limite · altura de "L" de "Límite" / 0,724 (verificación)',
  );
  add(
    'detail.description.color',
    d.inkColor(box(desc), BG),
    'ajustes-ayuda · "Encuentra respuestas…"',
  );
  add(
    'detail.description.size',
    round((d.firstGlyphHeight(box(desc), BG) ?? 0) / CAP_RATIO),
    'ajustes-ayuda · altura de "E" / 0,724',
  );
  add('detail.row.label.color', d.inkColor(box(lab), WHITE), 'ajustes-ayuda · "Centro de ayuda"');
  add(
    'detail.row.label.size',
    round((d.firstGlyphHeight(box(lab), WHITE) ?? 0) / CAP_RATIO),
    'ajustes-ayuda · altura de "C" / 0,724',
  );
  add(
    'detail.row.detail.color',
    d.inkColor(box(det), WHITE),
    'ajustes-ayuda · "Aprende a usar Pigxel"',
  );
  add(
    'detail.row.detail.size',
    round((d.firstGlyphHeight(box(det), WHITE) ?? 0) / CAP_RATIO),
    'ajustes-ayuda · altura de "A" / 0,724',
  );
  const dv = find('ajustes-ayuda', named('Divisor'));
  add('divider.color', d.hex(dv.ax + 100, dv.ay + 0.5), 'ajustes-ayuda · Divisor');
  const chev = find('ajustes-ayuda', named('chevron-right'));
  add('chevron.color', d.inkColor(box(chev), WHITE), 'ajustes-ayuda · chevron-right');
  const ico = find('ajustes-ayuda', (x) => x.name === 'book-open');
  add(
    'rowIcon.glyph.color',
    d.inkColor(box(ico), fromHex(d.hex(ico.ax - 8, ico.ay + 10))),
    'ajustes-ayuda · book-open',
  );
  const campo = shot('ajustes-informacion-personal');
  const et = find('ajustes-informacion-personal', (x) => x.tag === 'text' && x.name === 'Etiqueta');
  const val = find('ajustes-informacion-personal', (x) => x.tag === 'text' && x.name === 'Valor');
  add(
    'field.info.label.color',
    campo.inkColor(box(et), WHITE),
    'ajustes-informacion-personal · "Nombre completo"',
  );
  add(
    'field.info.label.size',
    round((campo.firstGlyphHeight(box(et), WHITE) ?? 0) / CAP_RATIO),
    'ajustes-informacion-personal · altura de "N" / 0,724',
  );
  add(
    'field.info.value.color',
    campo.inkColor(box(val), WHITE),
    'ajustes-informacion-personal · "Kevin…"',
  );
  add(
    'field.info.value.size',
    round((campo.firstGlyphHeight(box(val), WHITE) ?? 0) / CAP_RATIO),
    'ajustes-informacion-personal · altura de "K" / 0,724',
  );
}
// Interruptor
{
  const s = shot('ajustes-limite');
  const on = find('ajustes-limite', named('Activado'));
  add(
    'toggle.on.fill',
    s.hex(on.ax + 6, on.ay + on.height / 2),
    'ajustes-limite · fondo encendido',
  );
  const knob = find('ajustes-limite', named('Control'));
  add(
    'toggle.knob.fill',
    s.hex(knob.ax + knob.width / 2, knob.ay + knob.height / 2),
    'ajustes-limite · perilla',
  );
  add(
    'toggle.size',
    `${on.width}×${on.height} (perilla ${knob.width})`,
    'ajustes-limite · Activado / Control',
  );
  const n = shot('ajustes-notificaciones');
  const off = find('ajustes-notificaciones', named('Desactivado'));
  add(
    'toggle.off.fill',
    n.hex(off.ax + off.width - 6, off.ay + off.height / 2),
    'ajustes-notificaciones · fondo apagado',
  );
}
// Progreso de objetivos
{
  const s = shot('ajustes-objetivos');
  const track = find('ajustes-objetivos', named('Barra'));
  const fill = find('ajustes-objetivos', named('Avance'));
  add(
    'progress.track',
    s.hex(track.ax + track.width - 6, track.ay + 3),
    'ajustes-objetivos · pista',
  );
  add('progress.fill', s.hex(fill.ax + 8, fill.ay + 3), 'ajustes-objetivos · avance (azul)');
  add(
    'progress.height',
    `${track.height} (radio ${round(track.height / 2)})`,
    'ajustes-objetivos · Barra',
  );
  const pct = find('ajustes-objetivos', named('Porcentaje'));
  add(
    'progress.percent.color',
    s.inkColor(box(pct), WHITE),
    'ajustes-objetivos · "20% de tu meta"',
  );
  add(
    'progress.percent.size',
    round((s.firstGlyphHeight(box(pct), WHITE) ?? 0) / CAP_RATIO),
    'ajustes-objetivos · altura de la 1.ª cifra / 0,724',
  );
  const cuentas = shot('tab-cuentas-objetivos');
  const amount = find('tab-cuentas-objetivos', (x) => x.tag === 'text' && x.name === '¢100.000');
  add(
    'goalAmount.blue',
    cuentas.inkColor(box(amount), WHITE),
    'tab-cuentas-objetivos · monto "Objetivo" (azul)',
  );
  const ahorro = find('ajustes-objetivos', (x) => x.tag === 'text' && x.name === 'Monto', 0);
  add('goalSaved.color', s.inkColor(box(ahorro), WHITE), 'ajustes-objetivos · "Ahorro actual"');
  const meta = find('ajustes-objetivos', (x) => x.tag === 'text' && x.name === 'Monto', 1);
  add('goalTarget.color', s.inkColor(box(meta), WHITE), 'ajustes-objetivos · "Objetivo"');
  const lab = find('ajustes-objetivos', (x) => x.tag === 'text' && x.name === 'Etiqueta', 0);
  add('goalLabel.color', s.inkColor(box(lab), WHITE), 'ajustes-objetivos · "Ahorro actual"');
  add(
    'goalLabel.size',
    round((s.firstGlyphHeight(box(lab), WHITE) ?? 0) / CAP_RATIO),
    'ajustes-objetivos · altura de "A" / 0,724',
  );
}
// Caja informativa
{
  const s = shot('ajustes-limite');
  const note = find('ajustes-limite', named('Aviso de límite'));
  add(
    'infoNote.fill',
    s.hex(note.ax + note.width - 8, note.ay + note.height - 8),
    'ajustes-limite · fondo',
  );
  add(
    'infoNote.border',
    s.hex(note.ax - 0.5, note.ay + note.height / 2),
    'ajustes-limite · borde (exterior; igual al fondo si no hay trazo)',
  );
  add(
    'infoNote.radius',
    round(s.cornerRadius(box(note), BG) ?? 0),
    'ajustes-limite · esquina (aprox.)',
  );
  const t = find('ajustes-limite', (x) => x.name === 'Descripción' && x.width === 270);
  const tLine = { ...box(t), height: 20 };
  add(
    'infoNote.text.color',
    s.inkColor(box(t), fromHex(s.hex(note.ax + note.width - 8, note.ay + note.height - 8))),
    'ajustes-limite · texto del aviso',
  );
  add(
    'infoNote.text.size',
    round(
      (s.firstGlyphHeight(
        tLine,
        fromHex(s.hex(note.ax + note.width - 8, note.ay + note.height - 8)),
      ) ?? 0) / CAP_RATIO,
    ),
    'ajustes-limite · altura de la 1.ª mayúscula (1.ª línea) / 0,724',
  );
  const ic = find('ajustes-limite', named('info'));
  add(
    'infoNote.icon.color',
    s.inkColor(box(ic), fromHex(s.hex(note.ax + note.width - 8, note.ay + note.height - 8))),
    'ajustes-limite · ícono info',
  );
}
// OTP
{
  const s = shot('auth-codigo-verificacion');
  const cell = find('auth-codigo-verificacion', named('Rectangle 15'));
  const y = cell.ay + cell.height / 2 + 18;
  const segs = s.scanRow(y, 10, 392, WHITE, 6).filter((g) => g.to - g.from > 20);
  add(
    'otp.cells (x0→x1 · ancho)',
    segs.map((g) => `${round(g.from)}→${round(g.to)} · ${round(g.to - g.from)}`).join(' | '),
    `auth-codigo-verificacion · escaneo de la fila y=${round(y)}`,
  );
  add(
    'otp.cell.fill',
    segs[1]?.color ?? s.hex(cell.ax + 6, y),
    'auth-codigo-verificacion · casilla vacía',
  );
  add('otp.cell.size', `${cell.width}×${cell.height}`, 'auth-codigo-verificacion · Rectangle 15');
  add(
    'otp.cell.radius',
    round(s.cornerRadius(box(cell), WHITE) ?? 0),
    'auth-codigo-verificacion · esquina (aprox.)',
  );
  const resend = find(
    'auth-codigo-verificacion',
    (x) => x.tag === 'text' && x.name.startsWith('¿No recibiste'),
  );
  add(
    'otp.resend.size',
    round((s.firstGlyphHeight({ ...box(resend), ax: resend.ax + 80 }, WHITE) ?? 0) / CAP_RATIO),
    'auth-codigo-verificacion · altura de una mayúscula del texto de reenvío (aprox.)',
  );
  const firstLine = (b: Box, h: number): Box => ({ ...b, height: h });
  const t = find(
    'auth-codigo-verificacion',
    (x) => x.tag === 'text' && x.name.startsWith('Ingresa'),
  );
  add(
    'auth.title.size',
    round((s.firstGlyphHeight(firstLine(box(t), 44), WHITE) ?? 0) / CAP_RATIO),
    'auth-codigo-verificacion · altura de "I" (1.ª línea) / 0,724',
  );
  add(
    'auth.title.color',
    s.inkColor(firstLine(box(t), 44), WHITE),
    'auth-codigo-verificacion · título',
  );
  const sub = find(
    'auth-codigo-verificacion',
    (x) => x.tag === 'text' && x.name.startsWith('Hemos'),
  );
  add(
    'auth.subtitle.color',
    s.inkColor(box(sub), WHITE),
    'auth-codigo-verificacion · subtítulo gris',
  );
  add(
    'auth.subtitle.size',
    round((s.firstGlyphHeight(firstLine(box(sub), 22), WHITE) ?? 0) / CAP_RATIO),
    'auth-codigo-verificacion · altura de "H" (1.ª línea) / 0,724',
  );
}
// Estado vacío
{
  const s = shot('notificaciones');
  const info = find('notificaciones', named('Información'));
  const et = find('notificaciones', (x) => x.tag === 'text' && x.name === 'Etiqueta');
  const det = find('notificaciones', (x) => x.tag === 'text' && x.name === 'Detalle');
  const ic = find('notificaciones', named('Group'));
  add('empty.icon.color', s.inkColor(box(ic), BG), 'notificaciones · ícono');
  add('empty.title.color', s.inkColor(box(et), BG), 'notificaciones · "Sin notificaciones"');
  add(
    'empty.title.size',
    round((s.firstGlyphHeight(box(et), BG) ?? 0) / CAP_RATIO),
    'notificaciones · altura de "S" / 0,724',
  );
  add('empty.detail.color', s.inkColor(box(det), BG), 'notificaciones · detalle');
  add(
    'empty.detail.size',
    round((s.firstGlyphHeight(box(det), BG) ?? 0) / CAP_RATIO),
    'notificaciones · altura de "A" / 0,724',
  );
  add(
    'empty.layout',
    `bloque de texto ${info.width}×${info.height} @ (${info.ax}, ${info.ay}); ícono ${round(ic.width)}×${round(ic.height)} @ (${round(ic.ax)}, ${round(ic.ay)})`,
    'notificaciones · XML',
  );
}
// Títulos y textos de las pestañas principales
{
  const s = shot('tab-cuentas');
  const saldoLabel = find('tab-cuentas', (x) => x.tag === 'text' && x.name === 'Saldo total');
  add('mainTab.balanceLabel.color', s.inkColor(box(saldoLabel), BG), 'tab-cuentas · "Saldo total"');
  const obj = find('tab-cuentas', (x) => x.tag === 'text' && x.name === 'Objetivos');
  add(
    'mainTab.inactiveTab.color',
    s.inkColor(box(obj), BG),
    'tab-cuentas · "Objetivos" (inactiva)',
  );
  const cu = find('tab-cuentas', (x) => x.tag === 'text' && x.name === 'Cuentas');
  add('mainTab.activeTab.color', s.inkColor(box(cu), BG), 'tab-cuentas · "Cuentas" (activa)');
  const sub = find('tab-cuentas', (x) => x.tag === 'text' && x.name === 'Banco de Costa Rica');
  add('row.subtitle.color', s.inkColor(box(sub), WHITE), 'tab-cuentas · subtítulo de fila');
  const rec = find('tab-cuentas', (x) => x.tag === 'text' && x.name === '-¢18.000');
  add('amount.expense.color', s.inkColor(box(rec), WHITE), 'tab-cuentas · monto de gasto');
  const act = shot('tab-actividad');
  const inc = find('tab-actividad', (x) => x.tag === 'text' && x.name === '+¢718.000');
  add('amount.income.color', act.inkColor(box(inc), WHITE), 'tab-actividad · monto de ingreso');
  const hoy = find('tab-actividad', (x) => x.tag === 'text' && x.name === 'Hoy');
  add('sectionLabel.color', act.inkColor(box(hoy), BG), 'tab-actividad · "Hoy"');
  add(
    'sectionLabel.size',
    round((act.firstGlyphHeight(box(hoy), BG) ?? 0) / CAP_RATIO),
    'tab-actividad · altura de "H" / 0,724',
  );
  const gl = find('tab-actividad', (x) => x.tag === 'text' && x.name === 'Gastos' && x.ay < 200);
  add(
    'activity.caption.color',
    act.inkColor(box(gl), BG),
    'tab-actividad · "Gastos" sobre el monto',
  );
  const lg = shot('ajustes-limite');
  void lg;
  const tab = shot('tab-ajustes');
  const sec = nodes('tab-ajustes').find((x) => x.tag === 'text' && x.name === 'Cuenta');
  if (sec)
    add(
      'settingsMenu.sectionTitle.size',
      round((tab.firstGlyphHeight(box(sec), BG) ?? 0) / CAP_RATIO),
      'tab-ajustes · altura de "C" / 0,724',
    );
}
// Gráfica
{
  const s = shot('tab-actividad');
  const g = find('tab-actividad', (x) => x.name.startsWith('Screenshot'));
  const px = s
    .pixels(box(g))
    .map((p) => p.rgb)
    .filter((c) => c[0] < 60 && c[1] < 60 && c[2] < 60);
  add(
    'chart.line.color',
    px.length
      ? toHex(
          [0, 1, 2].map((k) => px.reduce((a, c) => a + c[k]!, 0) / px.length) as [
            number,
            number,
            number,
          ],
        )
      : 'n/d',
    'tab-actividad · píxeles oscuros de la curva',
  );
  add(
    'chart.area.fill',
    s.hex(g.ax + 120, g.ay + g.height - 30),
    'tab-actividad · degradado bajo la curva (cerca de la base)',
  );
  add(
    'chart.size',
    `${g.width}×${g.height} @ (${g.ax}, ${g.ay})`,
    'tab-actividad · imagen de la gráfica',
  );
}
// Glass: perfiles verticales de la captura REAL del cliente (aprox.: baja resolución, 0,97x)
{
  const ref = Shot.load(join(SPEC, 'reference/tab-cuentas-composed-reference.png'));
  const profile = (x: number, y0: number, y1: number) => {
    const runs: string[] = [];
    let last = '';
    let from = y0;
    for (let y = y0; y <= y1; y += 0.5) {
      const h = ref.hex(x, y);
      if (h !== last) {
        if (last) runs.push(`${from}–${y - 0.5}pt ${last}`);
        last = h;
        from = y;
      }
    }
    runs.push(`${from}–${y1}pt ${last}`);
    return runs.join(' · ');
  };
  add(
    'glass.reference',
    `${ref.png.width}×${ref.png.height} px (≈ ${round(ref.scale, 2)}x)`,
    'reference/tab-cuentas-composed-reference.png (captura real de Figma con vidrio)',
  );
  add(
    'glass.pill.profile(x=centro de "Ingreso", y 258→322)',
    profile(34 + 107 / 2, 258, 322),
    'píldora 107×50 en (34, 265): fondo → aro claro → relleno → sombra',
  );
  add(
    'glass.tabBar.profile(x=200, y 975→1050)',
    profile(200, 975, 1050),
    'tab bar 249×61 en (76, 982): zona entre los íconos',
  );
  add(
    'glass.tabBar.activeProfile(x=118, y 975→1050)',
    profile(118, 975, 1050),
    'pestaña activa 85×61 en (76, 982): borde → relleno → borde',
  );
  add('glass.button.profile(x=367, y 30→100)', profile(350, 30, 100), 'botón + 50×50 (aprox.)');
}

table(
  ['Token', 'Valor', 'Cómo / dónde se midió'],
  samples.map((s) => [s.token, `\`${s.value}\``, s.how]),
);
json.samples = Object.fromEntries(samples.map((s) => [s.token, s.value]));

// ───────────────────────── 3. ÍCONOS (colores de los SVG) ─────────────────────────
section('3. Colores de los SVG de los íconos fijos');
{
  const rows: (string | number)[][] = [];
  for (const group of ['tabs', 'ui', 'settings', 'add']) {
    const dir = join(__dirname, '../assets/icons', group);
    const files = (require('node:fs') as typeof import('node:fs'))
      .readdirSync(dir)
      .filter((f: string) => f.endsWith('.svg'));
    for (const f of files) {
      const svg = readFileSync(join(dir, f), 'utf8');
      const colors = [
        ...new Set(
          [...svg.matchAll(/(?:fill|stroke)="(#[0-9A-Fa-f]{3,8}|[a-z]+)"/g)]
            .map((m) => m[1])
            .filter((c) => c !== 'none'),
        ),
      ];
      rows.push([`${group}/${f.replace('.svg', '')}`, colors.join(', ') || '—']);
    }
  }
  table(['Ícono', 'Colores usados'], rows);
}

mkdirSync(DOCS, { recursive: true });
writeFileSync(
  join(DOCS, 'measurements.md'),
  [
    '# Medidas y colores extraídos del Figma',
    '',
    'Generado por `npm run measure` (`scripts/extract-measurements.ts`). No editar a mano.',
    'Fuentes: `design-spec/figma-metadata.xml` (medidas) y muestreo de `design-spec/screens/*.png` a 3x (colores, radios, tamaños).',
    'Tamaño de fuente estimado = altura de la primera mayúscula ÷ 0,724 (relación calibrada con títulos de 32 pt de SF Pro Rounded; ±0,5 pt).',
    ...out,
  ].join('\n'),
);
writeFileSync(join(DOCS, 'measurements.json'), `${JSON.stringify(json, null, 2)}\n`);
console.log(
  `docs/measurements.md y .json generados (${probes.length} sondas, ${samples.length} muestras).`,
);
