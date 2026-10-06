const MONTHS_SHORT = [
  'ene.',
  'feb.',
  'mar.',
  'abr.',
  'may.',
  'jun.',
  'jul.',
  'ago.',
  'sep.',
  'oct.',
  'nov.',
  'dic.',
];

/** "8:24 AM" (formato 12 h de los diseños). */
export function formatTime(date: Date): string {
  const h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, '0');
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 === 0 ? 12 : h % 12}:${m} ${suffix}`;
}

/** "11 oct. 2026" (próxima fecha de suscripciones). */
export function formatShortDate(date: Date): string {
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** "Hoy" | "Ayer" | "11 oct. 2026" para agrupar movimientos. */
export function dayLabel(date: Date, now: Date = new Date()): string {
  const diffDays = Math.round(
    (startOfDay(now).getTime() - startOfDay(date).getTime()) / 86_400_000,
  );
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  return formatShortDate(date);
}

const WEEKDAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS_LONG = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/** "martes 6 de octubre" (y " de 2025" si no es el año de `now`). Hora local. */
export function formatLongDate(date: Date, now: Date = new Date()): string {
  const base = `${WEEKDAYS[date.getDay()]} ${date.getDate()} de ${MONTHS_LONG[date.getMonth()]}`;
  return date.getFullYear() === now.getFullYear() ? base : `${base} de ${date.getFullYear()}`;
}

/** Encabezado de grupo de movimientos: "Hoy" · "Ayer" · "martes 6 de octubre". */
export function dayHeading(date: Date, now: Date = new Date()): string {
  const diffDays = Math.round(
    (startOfDay(now).getTime() - startOfDay(date).getTime()) / 86_400_000,
  );
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  return formatLongDate(date, now);
}

/** Clave de día local "2026-10-06" (para agrupar). */
export function dayKey(date: Date): string {
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Lunes = 0 … domingo = 6 (hora local): posición de `date` en la gráfica semanal Lun–Dom. */
export function weekdayPosition(date: Date): number {
  return (date.getDay() + 6) % 7;
}
