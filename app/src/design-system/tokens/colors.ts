/**
 * Colores del Figma. Fuente: design-spec/tokens.md + muestreo de design-spec/screens/*.png
 * (ver docs/measurements.md; npm run measure). Rojo y verde SOLO para montos y tarjetas de categoría.
 */
export const colors = {
  // Superficies
  bg: '#F4F4F4',
  /** Las pantallas de autenticación (y error 404) tienen fondo BLANCO. */
  authBg: '#FFFFFF',
  card: '#FFFFFF',
  border: '#EAEAEA',
  // Texto
  textPrimary: '#000000',
  textSecondary: '#8F8F8F',
  /** Placeholders de campos y detalle del estado vacío. */
  textPlaceholder: '#C1C1C1',
  // Controles
  segment: '#F0F0F0',
  segmentActive: '#FFFFFF',
  search: '#EBEBEB',
  /** Relleno de los campos de las pantallas de auth (fondo blanco). */
  fieldAuth: '#F0F0F0',
  /** Casillas del código de verificación. */
  otpCell: '#EAEAEA',
  divider: '#EAEAEA',
  chevron: '#C1C1C1',
  iconMuted: '#C1C1C1',
  /** Caja 44×44 del ícono en filas de detalle (sobre tarjeta blanca). */
  iconBox: '#F4F4F4',
  /** Caja 50×50 del ícono en el menú principal de Ajustes. */
  menuIconBox: '#F5F5F5',
  /** Caja 56×56 del ícono de encabezado en pantallas de detalle. */
  headerIconBox: '#EBEBEB',
  emojiCircle: '#FFFFFF',
  // Estados y datos
  expense: '#FF0000',
  income: '#65CA60',
  /** Montos "Objetivo" y avance de objetivos. */
  blue: '#007FFF',
  toggleOn: '#34C759',
  toggleOff: '#E9E9EB',
  toggleKnob: '#FFFFFF',
  progressTrack: '#E9E9EB',
  infoNoteBg: '#EAF8EE',
  infoNoteText: '#308548',
  chartLine: '#262626',
  tooltipBg: '#262626',
  // Botones
  buttonPrimary: '#000000',
  buttonPrimaryText: '#FFFFFF',
  white: '#FFFFFF',
  black: '#000000',
  /** Segunda y tercera parte del título de bienvenida. */
  titleMuted1: '#5E5E5F',
  titleMuted2: '#AFAFAF',
  /** Colores de los íconos coloridos del menú Agregar (assets/icons/add/*.svg). */
  addPiggy: '#69D95E',
  addNotebook: '#2F6BFF',
  addCard: '#E0B400',
  /** Paleta del brandbook. */
  brand: {
    objective: '#000000',
    creativity: '#454544',
    balance: '#A6A6A6',
    life: '#D9D9D9',
  },
} as const;

export type ColorName = keyof Omit<typeof colors, 'brand'>;
