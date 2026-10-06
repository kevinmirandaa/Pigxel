export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** Porcentaje entero de avance de un objetivo (0–100). */
export const percent = (current: number, target: number) =>
  target <= 0 ? 0 : Math.round(clamp((current / target) * 100, 0, 100));
