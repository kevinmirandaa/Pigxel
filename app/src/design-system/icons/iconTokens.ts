/**
 * Política de íconos (sin dependencias de React Native).
 *  · Un solo conjunto de línea (Lucide), trazo ABSOLUTO de 2 pt (así lo dibuja el Figma; 2,5 pt en los
 *    campos de auth y en glifos de botones de vidrio), puntas y esquinas redondeadas.
 *  · Tamaño por contexto: ver `iconSize`.
 */
export const iconStroke = {
  /** Trazo estándar en toda la app (2 pt). */
  default: 2,
  /** Campos de auth (medido en el Figma) y botones de vidrio. */
  firm: 2.5,
  /** Íconos grandes (estado vacío, carita del emoji): 3,33 pt medido. */
  large: 3.333,
} as const;

export const iconSize = {
  /** Barra de pestañas flotante. */
  tab: 28,
  /** Caja de ícono en filas de ajustes/detalle (caja 44) y menú principal (caja 50). */
  settingsRow: 20,
  /** Campos en píldora (mail, lock, ojo). */
  field: 20,
  /** Botones de vidrio de símbolo (atrás, +, campana, filtro). */
  glass: 22,
  /** Ícono de encabezado de detalle (caja 56). */
  header: 24,
  /** Chevron / check al final de fila. */
  trailing: 16,
  /** Flecha del botón negro. */
  arrow: 18,
  /** Menú Agregar (ícono de color en círculo de 50). */
  addMenu: 24,
  /** Estado vacío. */
  empty: 40,
} as const;

/** Tonos de color del menú Agregar (medidos en los SVG del Figma). */
export const addMenuTones = {
  piggy: '#69D95E',
  note: '#1261FF',
  card: '#D0C63F',
  goal: '#FF0303',
} as const;

/**
 * Mapa de reemplazo: ícono SVG antiguo del Figma (assets/icons/**) → ícono Lucide actual.
 * Los SVG antiguos siguen en disco como respaldo, pero la app ya no los usa.
 */
export const ICON_REPLACEMENTS = {
  // Menú principal de Ajustes
  'settings/person': 'user-round',
  'settings/mail': 'mail',
  'settings/key': 'key-round',
  'settings/wallet': 'wallet',
  'settings/limit': 'gauge',
  'settings/note': 'notebook-text',
  'settings/card': 'credit-card',
  'settings/goal': 'target',
  'settings/bell': 'bell',
  'settings/moon': 'moon',
  'settings/globe': 'globe',
  'settings/lock': 'lock',
  'settings/help': 'circle-help',
  // UI
  'ui/search': 'search',
  'ui/filter': 'list-filter',
  'ui/plus': 'plus',
  'ui/plus-gray': 'plus',
  'ui/chevron-back': 'chevron-left',
  'ui/chevron-row': 'chevron-right',
  'ui/arrow-button (Figma: vector de 15×14)': 'arrow-right',
  'notificaciones (campana con punto)': 'bell-dot',
  // Menú Agregar (color propio)
  'add/piggy-green': 'piggy-bank',
  'add/note-blue': 'notebook-text',
  'add/card-yellow': 'credit-card',
  'add/goal-red': 'target',
  // Barra de pestañas
  'tabs/wallet': 'wallet',
  'tabs/bars': 'chart-no-axes-column-increasing',
  'tabs/layers': 'layers',
} as const;
