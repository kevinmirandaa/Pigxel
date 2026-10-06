import { useEffect, useState } from 'react';

/** `true` cuando pasaron al menos `ms` desde el primer render (evita que el splash parpadee). */
export function useMinimumTime(ms: number): boolean {
  const [done, setDone] = useState(ms <= 0);
  useEffect(() => {
    if (done) return undefined;
    const id = setTimeout(() => setDone(true), ms);
    return () => clearTimeout(id);
  }, [done, ms]);
  return done;
}
