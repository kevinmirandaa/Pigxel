/** Opciones de Ajustes › App (sin dependencias de React Native). */
import type { Appearance, LanguageCode, NotificationPrefs } from '../../data/models';

export interface NotificationItem {
  key: keyof Omit<NotificationPrefs, 'email'>;
  title: string;
  subtitle: string;
  /** Nombre del ícono Lucide del design-system. */
  icon: string;
}

/** Las cinco filas de Ajustes › Notificaciones (el correo vive en Ajustes › Correo electrónico). */
export const NOTIFICATION_ITEMS: readonly NotificationItem[] = [
  {
    key: 'subscriptions',
    title: 'Suscripciones',
    subtitle: 'Recordatorios de próximas fechas',
    icon: 'credit-card',
  },
  { key: 'goals', title: 'Objetivos', subtitle: 'Progreso de tus metas de ahorro', icon: 'target' },
  { key: 'limit', title: 'Límite', subtitle: 'Alertas de tu límite en Consulta', icon: 'gauge' },
  {
    key: 'activity',
    title: 'Actividad',
    subtitle: 'Avisos sobre tus movimientos',
    icon: 'chart-no-axes-column',
  },
  { key: 'news', title: 'Novedades', subtitle: 'Actualizaciones de Pigxel', icon: 'sparkles' },
];

/** Devuelve las preferencias con una sola clave cambiada (no muta el original). */
export function withNotificationPref(
  prefs: NotificationPrefs,
  key: keyof NotificationPrefs,
  value: boolean,
): NotificationPrefs {
  return { ...prefs, [key]: value };
}

export const APPEARANCE_OPTIONS: readonly {
  value: Appearance;
  title: string;
  subtitle: string;
  icon: string;
}[] = [
  { value: 'light', title: 'Claro', subtitle: 'Una apariencia luminosa', icon: 'sun' },
  { value: 'dark', title: 'Oscuro', subtitle: 'Una apariencia oscura', icon: 'moon' },
  {
    value: 'system',
    title: 'Sistema',
    subtitle: 'Usa la apariencia de tu dispositivo',
    icon: 'monitor',
  },
];

/** Nombre nativo (negrita) y nombre en español (gris). */
export const LANGUAGE_OPTIONS: readonly { value: LanguageCode; native: string; spanish: string }[] =
  [
    { value: 'es', native: 'Español', spanish: 'Español' },
    { value: 'en', native: 'English', spanish: 'Inglés' },
    { value: 'pt', native: 'Português', spanish: 'Portugués' },
    { value: 'fr', native: 'Français', spanish: 'Francés' },
    { value: 'de', native: 'Deutsch', spanish: 'Alemán' },
  ];
