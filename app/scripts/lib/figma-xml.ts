/**
 * Lector mínimo de design-spec/figma-metadata.xml (árbol de nodos de Figma con tamaños y posiciones).
 * Las posiciones de los hijos son RELATIVAS a su padre; aquí se acumulan a absolutas dentro del frame.
 */
import { readFileSync } from 'node:fs';

export interface FigmaNode {
  tag: string;
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Posición relativa a la esquina superior izquierda del FRAME (pantalla). */
  ax: number;
  ay: number;
  depth: number;
  children: FigmaNode[];
  parent: FigmaNode | null;
}

const decode = (s: string) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

function parseAttrs(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const m of raw.matchAll(/([\w:-]+)="([^"]*)"/g))
    attrs[m[1] as string] = decode(m[2] as string);
  return attrs;
}

export function parseFigmaXml(path: string): FigmaNode[] {
  const xml = readFileSync(path, 'utf8');
  const frames: FigmaNode[] = [];
  const stack: FigmaNode[] = [];
  for (const m of xml.matchAll(/<(\/?)([\w-]+)([^>]*?)(\/?)>/g)) {
    const [, closing, tag, rawAttrs, selfClose] = m as unknown as [
      string,
      string,
      string,
      string,
      string,
    ];
    if (closing) {
      stack.pop();
      continue;
    }
    const a = parseAttrs(rawAttrs);
    const parent = stack[stack.length - 1] ?? null;
    const topLevel = parent?.tag === 'canvas' || parent === null;
    const node: FigmaNode = {
      tag,
      id: a.id ?? '',
      name: a.name ?? '',
      x: Number(a.x ?? 0),
      y: Number(a.y ?? 0),
      width: Number(a.width ?? 0),
      height: Number(a.height ?? 0),
      ax: 0,
      ay: 0,
      depth: stack.length,
      children: [],
      parent,
    };
    // Dentro de un frame de pantalla, la posición es relativa a ese frame (el frame es el origen).
    if (parent && parent.tag !== 'canvas') {
      node.ax = parent.ax + node.x;
      node.ay = parent.ay + node.y;
    }
    parent?.children.push(node);
    if (!selfClose) stack.push(node);
    if (tag === 'frame' && parent?.tag === 'canvas' && topLevel) frames.push(node);
  }
  return frames;
}

export function* walk(node: FigmaNode): Generator<FigmaNode> {
  yield node;
  for (const c of node.children) yield* walk(c);
}

export const SCREEN_IDS: Record<string, string> = {
  '1:3': 'auth-splash',
  '7:201': 'auth-bienvenida',
  '7:205': 'auth-crear-cuenta',
  '9:195': 'auth-iniciar-sesion',
  '9:448': 'auth-recuperar-contrasena',
  '9:479': 'auth-codigo-verificacion',
  '9:513': 'auth-nueva-contrasena',
  '9:539': 'error-404',
  '14:40': 'tab-cuentas',
  '26:508': 'tab-cuentas-objetivos',
  '23:420': 'tab-actividad',
  '35:114': 'tab-ajustes',
  '38:395': 'add-menu',
  '41:853': 'add-lista-cuentas',
  '41:922': 'add-lista-categorias',
  '38:571': 'add-cuenta',
  '38:686': 'add-categoria',
  '38:714': 'add-suscripcion',
  '38:763': 'add-objetivo',
  '41:828': 'add-ingreso',
  '41:976': 'add-gasto',
  '2008:1788': 'consultar',
  '2008:1835': 'notificaciones',
  '2004:11625': 'ajustes-informacion-personal',
  '2004:11710': 'ajustes-correo',
  '2004:11803': 'ajustes-contrasena',
  '2004:11903': 'ajustes-moneda',
  '2004:11995': 'ajustes-limite',
  '2004:12085': 'ajustes-categorias',
  '2004:12227': 'ajustes-suscripciones',
  '2004:12342': 'ajustes-objetivos',
  '2004:12444': 'ajustes-notificaciones',
  '2004:12559': 'ajustes-apariencia',
  '2004:12654': 'ajustes-idioma',
  '2004:12749': 'ajustes-privacidad',
  '2004:12859': 'ajustes-ayuda',
};
