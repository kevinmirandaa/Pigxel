/** Geometría de la gráfica de línea (sin React Native: se prueba en Node). */

export type Pt = { x: number; y: number };

/** Interpolación cúbica monótona (Fritsch–Carlson): suave, sin desbordes bajo el eje ni sobre el máximo. */
export function monotonePath(pts: readonly Pt[]): string {
  const n = pts.length;
  if (n === 0) return '';
  if (n === 1) return `M${pts[0]!.x} ${pts[0]!.y}`;
  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i += 1) {
    dx.push(pts[i + 1]!.x - pts[i]!.x);
    m.push((pts[i + 1]!.y - pts[i]!.y) / dx[i]!);
  }
  const t: number[] = [m[0]!];
  for (let i = 1; i < n - 1; i += 1) t.push(m[i - 1]! * m[i]! <= 0 ? 0 : (m[i - 1]! + m[i]!) / 2);
  t.push(m[n - 2]!);
  for (let i = 0; i < n - 1; i += 1) {
    if (m[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i]! / m[i]!;
    const b = t[i + 1]! / m[i]!;
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      t[i] = k * a * m[i]!;
      t[i + 1] = k * b * m[i]!;
    }
  }
  let d = `M${pts[0]!.x.toFixed(2)} ${pts[0]!.y.toFixed(2)}`;
  for (let i = 0; i < n - 1; i += 1) {
    const h = dx[i]! / 3;
    d += ` C${(pts[i]!.x + h).toFixed(2)} ${(pts[i]!.y + t[i]! * h).toFixed(2)} ${(pts[i + 1]!.x - h).toFixed(2)} ${(pts[i + 1]!.y - t[i + 1]! * h).toFixed(2)} ${pts[i + 1]!.x.toFixed(2)} ${pts[i + 1]!.y.toFixed(2)}`;
  }
  return d;
}
