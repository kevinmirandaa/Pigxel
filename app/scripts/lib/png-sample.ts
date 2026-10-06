/// <reference types="node" />
/**
 * Muestreo de capturas de design-spec/screens/*.png (3x) con pngjs.
 * Todas las coordenadas de entrada/salida están en PUNTOS de Figma (frame de 402 de ancho).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { PNG } from 'pngjs';

export type RGB = [number, number, number];
export interface Box {
  ax: number;
  ay: number;
  width: number;
  height: number;
}

export const toHex = ([r, g, b]: RGB) =>
  `#${[r, g, b]
    .map((v) => Math.round(v).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
export const fromHex = (hex: string): RGB => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];
export const distance = (a: RGB, b: RGB) =>
  Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);

const cache = new Map<string, Shot>();

export class Shot {
  readonly png: PNG;
  readonly scale: number;
  private constructor(readonly path: string) {
    this.png = PNG.sync.read(readFileSync(path));
    this.scale = this.png.width / 402;
  }

  static load(path: string): Shot {
    let s = cache.get(path);
    if (!s) {
      s = new Shot(path);
      cache.set(path, s);
    }
    return s;
  }

  static screen(designSpecDir: string, name: string): Shot {
    return Shot.load(join(designSpecDir, 'screens', `${name}.png`));
  }

  /** Color del píxel que contiene el punto (x, y). */
  rgb(x: number, y: number): RGB {
    const px = Math.min(this.png.width - 1, Math.max(0, Math.floor(x * this.scale)));
    const py = Math.min(this.png.height - 1, Math.max(0, Math.floor(y * this.scale)));
    const i = (py * this.png.width + px) * 4;
    const d = this.png.data;
    const a = (d[i + 3] as number) / 255;
    // Compone sobre blanco si hay transparencia.
    return [0, 1, 2].map((k) => Math.round((d[i + k] as number) * a + 255 * (1 - a))) as RGB;
  }

  hex(x: number, y: number): string {
    return toHex(this.rgb(x, y));
  }

  /** Píxeles de una caja (en puntos) → lista de colores. */
  pixels(box: Box): { rgb: RGB; x: number; y: number }[] {
    const out: { rgb: RGB; x: number; y: number }[] = [];
    const step = 1 / this.scale;
    for (let y = box.ay; y < box.ay + box.height; y += step) {
      for (let x = box.ax; x < box.ax + box.width; x += step) {
        out.push({ rgb: this.rgb(x + step / 2, y + step / 2), x, y });
      }
    }
    return out;
  }

  /** Caja de tinta (píxeles distintos del fondo) dentro de `box`, en puntos. */
  inkBox(box: Box, bg: RGB, tolerance = 60): Box | null {
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const p of this.pixels(box)) {
      if (distance(p.rgb, bg) > tolerance) {
        x0 = Math.min(x0, p.x);
        y0 = Math.min(y0, p.y);
        x1 = Math.max(x1, p.x);
        y1 = Math.max(y1, p.y);
      }
    }
    if (!Number.isFinite(x0)) return null;
    const step = 1 / this.scale;
    return { ax: x0, ay: y0, width: x1 - x0 + step, height: y1 - y0 + step };
  }

  /** Color de la tinta: promedio del 15 % de píxeles más lejanos del fondo. */
  inkColor(box: Box, bg: RGB): string | null {
    const px = this.pixels(box)
      .map((p) => ({ rgb: p.rgb, d: distance(p.rgb, bg) }))
      .filter((p) => p.d > 40)
      .sort((a, b) => b.d - a.d);
    if (px.length === 0) return null;
    const top = px.slice(0, Math.max(1, Math.ceil(px.length * 0.15)));
    const avg = [0, 1, 2].map((k) => top.reduce((s, p) => s + p.rgb[k]!, 0) / top.length) as RGB;
    return toHex(avg);
  }

  /** Altura de la primera letra (en puntos): para estimar el tamaño de fuente por altura de mayúscula. */
  firstGlyphHeight(box: Box, bg: RGB): number | null {
    const ink = this.inkBox(box, bg);
    if (!ink) return null;
    const step = 1 / this.scale;
    // Avanza columna a columna hasta encontrar el primer hueco: eso delimita la primera letra.
    let x = ink.ax;
    let seen = false;
    let top = Infinity;
    let bottom = -Infinity;
    for (; x < ink.ax + ink.width; x += step) {
      let colInk = false;
      for (let y = ink.ay - step; y < ink.ay + ink.height + step; y += step) {
        if (distance(this.rgb(x + step / 2, y + step / 2), bg) > 60) {
          colInk = true;
          top = Math.min(top, y);
          bottom = Math.max(bottom, y);
        }
      }
      if (colInk) seen = true;
      else if (seen) break;
    }
    return seen ? bottom - top + step : null;
  }

  /** Tramos horizontales de tinta en la fila `y` (para detectar casillas, barras, etc.). */
  scanRow(
    y: number,
    x0: number,
    x1: number,
    bg: RGB,
    tolerance = 6,
  ): { from: number; to: number; color: string }[] {
    const segs: { from: number; to: number; color: string }[] = [];
    const step = 1 / this.scale;
    let start: number | null = null;
    let color = '';
    for (let x = x0; x <= x1; x += step) {
      const c = this.rgb(x + step / 2, y);
      const inside = distance(c, bg) > tolerance;
      if (inside && start === null) {
        start = x;
        color = toHex(c);
      }
      if (!inside && start !== null) {
        segs.push({ from: start, to: x, color });
        start = null;
      }
    }
    if (start !== null) segs.push({ from: start, to: x1, color });
    return segs;
  }

  /** Radio de esquina (puntos) de una forma rellena sobre `outside`, midiendo la diagonal desde la esquina. */
  cornerRadius(box: Box, outside: RGB): number | null {
    const step = 1 / (this.scale * 2);
    const corners: [number, number, number, number][] = [
      [box.ax, box.ay, 1, 1],
      [box.ax + box.width, box.ay, -1, 1],
      [box.ax, box.ay + box.height, 1, -1],
      [box.ax + box.width, box.ay + box.height, -1, -1],
    ];
    const rs: number[] = [];
    for (const [cx, cy, sx, sy] of corners) {
      for (let d = 0; d < Math.min(box.width, box.height) / 2; d += step) {
        const c = this.rgb(cx + sx * (d + step / 2), cy + sy * (d + step / 2));
        if (distance(c, outside) > 8) {
          // Distancia horizontal al primer píxel de la forma; r = d / (1 − 1/√2).
          rs.push(d / (1 - Math.SQRT1_2));
          break;
        }
      }
    }
    if (rs.length === 0) return null;
    return rs.reduce((a, b) => a + b, 0) / rs.length;
  }
}
