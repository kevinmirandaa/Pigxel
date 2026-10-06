import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';

import { SCREEN_MARGIN, columnWidth, contentWidth } from './metrics';

const OverrideContext = createContext<number | null>(null);

/** Fija el ancho de pantalla que ven los hijos (la galería lo usa para simular 360/375/390/402/430). */
export function ScreenWidthProvider({ width, children }: { width: number; children: ReactNode }) {
  return <OverrideContext.Provider value={width}>{children}</OverrideContext.Provider>;
}

export interface ScreenMetrics {
  /** Ancho de la ventana (o el simulado). */
  screenWidth: number;
  /** Ancho de la columna de la app (máx. 440). */
  columnWidth: number;
  margin: number;
  /** Ancho para el contenido: columna − 2 × margen. */
  contentWidth: number;
}

/** Medidas de pantalla para componentes que necesitan números (cuadrículas, gráfica). Un solo sitio por componente. */
export function useScreenMetrics(margin: number = SCREEN_MARGIN): ScreenMetrics {
  const { width } = useWindowDimensions();
  const override = useContext(OverrideContext);
  const screenWidth = override ?? width;
  return useMemo(
    () => ({
      screenWidth,
      columnWidth: columnWidth(screenWidth),
      margin,
      contentWidth: contentWidth(screenWidth, margin),
    }),
    [screenWidth, margin],
  );
}
