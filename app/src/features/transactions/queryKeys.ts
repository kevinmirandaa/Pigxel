import type { ActivityMode } from './activity';

/** Claves de consulta de Actividad. Cualquier mutación de movimientos debe invalidar `activityKeys.all`. */
export const activityKeys = {
  all: ['activity'] as const,
  weekly: (mode: ActivityMode) => ['activity', 'weekly', mode] as const,
  list: (mode: ActivityMode, search: string) => ['activity', 'list', mode, search] as const,
};
