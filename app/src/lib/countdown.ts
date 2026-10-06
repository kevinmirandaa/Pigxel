/** Cuenta regresiva del reenvío de código (lógica pura, sin React Native). */
export const RESEND_SECONDS = 59;

/** Segundos que faltan hasta `endAt` (ms epoch); nunca negativo. Basado en el reloj, no en ticks: sobrevive a segundo plano. */
export function remainingSeconds(endAt: number, now: number): number {
  return Math.max(0, Math.ceil((endAt - now) / 1000));
}

/** 59 → "00:59" · 5 → "00:05" · 0 → "00:00" · 75 → "01:15". */
export function formatCountdown(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/** Instante (ms epoch) en que termina una cuenta regresiva que empieza ahora. */
export const countdownEnd = (now: number, seconds: number = RESEND_SECONDS): number =>
  now + seconds * 1000;
