/** Medidas en puntos sobre el frame base de 402×874 (docs/measurements.md). */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 36,
} as const;

export const layout = {
  /** Margen lateral FIJO del contenido (tarjetas, campos, botones). El contenido se estira (ver metrics.ts). */
  screenMargin: 36,
  /** Menú principal de Ajustes: margen 39. */
  settingsMargin: 39,
  /** Distancia del título a la parte superior (bajo el botón de vidrio): y=98 en el frame. */
  titleTop: 98,
  /** Botón atrás / "+" en pantallas de formulario y detalle. */
  backButtonTop: 20,
  backButtonLeft: 20,
  /** Título de pestañas principales ("Pigxel", "Actividad", "Ajustes"): (39, 45). */
  tabTitleTop: 45,
  tabTitleLeft: 36,
  /** Botones de vidrio de la cabecera de pestañas: y=40, el último a x=325 (derecha: 27 pt). */
  headerButtonsTop: 40,
  headerButtonsRight: 36,
  glassButtonSize: 50,
  /** Píldoras Ingreso/Gasto/Consulta: alto 50, anchos 107/93/120, y=265. */
  glassPillHeight: 50,
  card: { height: 74, borderWidth: 1 },
  /** Gap entre tarjetas: varía por pantalla (7–18); ver docs/measurements.md §1.1. */
  cardGap: 8,
  emojiSize: 35,
  field: {
    height: 60,
    iconLeft: 24,
    iconSize: 20,
    textLeftNoIcon: 23,
    textLeftWithIcon: 53,
    eyeLeft: 284,
  },
  primaryButton: { height: 60 },
  segmented: { maxWidth: 252.5, height: 48, padding: 3, activeExtra: 3, activeHeight: 44 },
  search: { height: 53 },
  tabsUnderline: { width: 50, thickness: 4, labelWidth: 115 },
  emojiTrigger: { size: 80, glyph: 33.333 },
  headerIcon: { size: 56, glyph: 24 },
  rowIconBox: 44,
  menuIconBox: 50,
  settingsRow: {
    height: 67,
    rowWithDividerHeight: 68,
    iconLeft: 12,
    textLeft: 68,
    chevronRight: 12,
    chevron: 14,
  },
  /** Divisores: con ícono empiezan a x=60 (de la tarjeta); sin ícono, a x=20. */
  dividerInset: { withIcon: 60, noIcon: 20 },
  toggle: { width: 50, height: 30, knob: 26, knobInset: 2 },
  progress: { height: 6 },
  infoNote: { padding: 16, icon: 18, textLeft: 44 },
  otp: { cellHeight: 77, gap: 5.4 },
  chart: { height: 124, fallbackWidth: 312 },
  /** Barra de pestañas: tamaño intrínseco (centrada); 17 pt sobre el borde físico inferior (protocolo de pantallas). */
  tabBar: { width: 249, height: 61, activeWidth: 85, bottom: 17 },
  /** Espacio libre al final del scroll para no quedar bajo la barra flotante (61 + 17 + holgura). */
  tabBarClearance: 94,
} as const;
