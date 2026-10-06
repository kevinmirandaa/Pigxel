/**
 * Exportación de datos del usuario ("Descargar datos"). Sin dependencias de React Native.
 * Solo reúne lo que devuelven los repositorios del usuario con sesión (protegidos por RLS): nunca tokens,
 * contraseñas ni datos de otras personas.
 */
import type { Repositories } from '../../data/repositories';

export const EXPORT_VERSION = 1;

export interface DataExport {
  app: 'Pigxel';
  version: number;
  exportedAt: string;
  profile: { fullName: string; username: string; email: string; phone: string | null };
  settings: Awaited<ReturnType<Repositories['settings']['getSettings']>>;
  accounts: Awaited<ReturnType<Repositories['accounts']['list']>>;
  categories: Awaited<ReturnType<Repositories['categories']['list']>>;
  transactions: Awaited<ReturnType<Repositories['transactions']['list']>>;
  subscriptions: Awaited<ReturnType<Repositories['subscriptions']['list']>>;
  goals: Awaited<ReturnType<Repositories['goals']['list']>>;
}

export async function buildDataExport(
  repos: Pick<
    Repositories,
    'settings' | 'accounts' | 'categories' | 'transactions' | 'subscriptions' | 'goals'
  >,
  now: Date = new Date(),
): Promise<DataExport> {
  const [profile, settings, accounts, categories, transactions, subscriptions, goals] =
    await Promise.all([
      repos.settings.getProfile(),
      repos.settings.getSettings(),
      repos.accounts.list(),
      repos.categories.list(),
      repos.transactions.list(),
      repos.subscriptions.list(),
      repos.goals.list(),
    ]);
  return {
    app: 'Pigxel',
    version: EXPORT_VERSION,
    exportedAt: now.toISOString(),
    // Se copian solo los campos del perfil (sin identificadores internos).
    profile: {
      fullName: profile.fullName,
      username: profile.username,
      email: profile.email,
      phone: profile.phone,
    },
    settings,
    accounts,
    categories,
    transactions,
    subscriptions,
    goals,
  };
}

/** JSON legible (2 espacios, tildes y emojis sin escapar). */
export const serializeExport = (data: DataExport): string => JSON.stringify(data, null, 2);
