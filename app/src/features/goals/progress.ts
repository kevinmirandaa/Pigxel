import { percent } from '@/lib/utils';

/** "20% de tu meta" en tarjetas de objetivos. */
export const goalProgress = (current: number, target: number) => percent(current, target);
