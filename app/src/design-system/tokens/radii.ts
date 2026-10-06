export const radii = {
  /** Tarjetas de fila, tarjetas de ajustes, caja informativa (get_design_context: rounded-[20px]). */
  card: 20,
  /** Píldoras: campos, botones, segmentados (el radio es ≥ alto/2, p. ej. 30 en 60 pt de alto). */
  pill: 50,
  /** Casillas del código OTP (muestreo: ≈15). */
  otp: 15,
  /** Caja del ícono de encabezado 56×56 (muestreo: ≈16). */
  headerIcon: 16,
  /** Cajas de ícono dentro de filas (44×44 y 50×50). */
  rowIcon: 14,
  full: 999,
} as const;
