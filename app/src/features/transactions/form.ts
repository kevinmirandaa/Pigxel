/** Lógica pura de los formularios de Ingreso/Gasto (sin React Native). */
import type { Account } from '../../data/models';

/** Valor de la opción "Sin categoría" en la hoja de selección. */
export const NO_CATEGORY_VALUE = '__none__';

/** Cuenta por defecto: la elegida si todavía existe; si no, la primera. */
export function resolveAccountId(
  accounts: readonly Account[],
  chosen: string | null,
): string | null {
  if (chosen && accounts.some((a) => a.id === chosen)) return chosen;
  return accounts[0]?.id ?? null;
}

/** Categoría elegida → id para guardar (`null` = sin categoría). */
export function categoryIdFromChoice(choice: string | null): string | null {
  return choice === null || choice === NO_CATEGORY_VALUE ? null : choice;
}
