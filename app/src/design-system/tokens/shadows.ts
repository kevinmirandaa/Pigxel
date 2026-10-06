/**
 * Vidrio (Liquid Glass) — valores medidos en la captura real del cliente
 * (design-spec/reference/tab-cuentas-composed-reference.png) sobre fondo #F4F4F4.
 * Perfil vertical de una píldora: borde exterior #EEE → resalte #F7F7F7 → sombra interior #EBEBEB (≈15 % de la altura)
 * → aclara hacia abajo → brillo blanco inferior; sombra exterior muy suave. Se expresa con alfa (blanco/negro)
 * para que funcione igual sobre fondo gris o blanco.
 */
export const glass = {
  gradient: {
    colors: [
      'rgba(255,255,255,0.55)',
      'rgba(0,0,0,0.045)',
      'rgba(0,0,0,0.012)',
      'rgba(255,255,255,0.7)',
      'rgba(255,255,255,1)',
    ],
    locations: [0, 0.14, 0.62, 0.9, 1],
  },
  /** Pestaña activa del tab bar: cápsula más oscura con contorno visible (#E7E7E7). */
  activeGradient: {
    colors: ['rgba(0,0,0,0.035)', 'rgba(0,0,0,0.068)', 'rgba(0,0,0,0.045)', 'rgba(0,0,0,0.02)'],
    locations: [0, 0.15, 0.6, 1],
  },
  border: 'rgba(0,0,0,0.035)',
  activeBorder: 'rgba(0,0,0,0.06)',
  /** Brillo blanco bajo el borde inferior + sombra suave (react-native boxShadow). */
  boxShadow: '0 1.5 0 rgba(255,255,255,0.9), 0 4 8 rgba(0,0,0,0.05)',
} as const;

/** Compatibilidad con código previo. */
export const shadows = {
  glass: {
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
} as const;
