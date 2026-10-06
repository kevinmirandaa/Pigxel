import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { glass } from '../tokens';

/**
 * Liquid Glass NATIVO (iOS 26+) si el módulo existe y el sistema lo soporta; si no, el respaldo
 * dibujado con los valores medidos en la captura real del cliente (ver tokens/shadows.ts).
 * Todo se comprueba en tiempo de ejecución: si `expo-glass-effect` no está disponible (Expo Go sin
 * el módulo, iOS anterior, Android) no se rompe nada.
 */
type GlassModule = typeof import('expo-glass-effect');
let glassModule: GlassModule | null = null;
let nativeGlass: boolean | null = null;

export function isNativeGlassAvailable(): boolean {
  if (nativeGlass !== null) return nativeGlass;
  try {
    // require perezoso A PROPÓSITO: si el módulo nativo no existe (Expo Go, otra plataforma) no debe fallar al importar.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    glassModule = require('expo-glass-effect') as GlassModule;
    nativeGlass = glassModule.isLiquidGlassAvailable() === true;
  } catch {
    glassModule = null;
    nativeGlass = false;
  }
  return nativeGlass;
}

export type GlassVariant = 'default' | 'active';

export interface GlassSurfaceProps {
  radius: number;
  /** `active`: cápsula de la pestaña seleccionada del tab bar (más oscura, con contorno). */
  variant?: GlassVariant;
  interactive?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

export function GlassSurface({
  radius,
  variant = 'default',
  interactive = false,
  style,
  children,
}: GlassSurfaceProps) {
  const native = isNativeGlassAvailable();

  if (native && glassModule) {
    const { GlassView } = glassModule;
    return (
      <GlassView
        glassEffectStyle="regular"
        isInteractive={interactive}
        style={[{ borderRadius: radius }, style]}
      >
        {children}
      </GlassView>
    );
  }

  const gradient = variant === 'active' ? glass.activeGradient : glass.gradient;
  return (
    <View
      style={[
        { borderRadius: radius },
        variant === 'default' ? { boxShadow: glass.boxShadow } : null,
        style,
      ]}
    >
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: radius,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: variant === 'active' ? glass.activeBorder : glass.border,
          },
        ]}
      >
        <LinearGradient
          colors={[...gradient.colors] as [string, string, ...string[]]}
          locations={[...gradient.locations] as [number, number, ...number[]]}
          style={StyleSheet.absoluteFill}
        />
      </View>
      {children}
    </View>
  );
}
