import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii } from '../tokens';

export interface CardProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  /** Relleno de la tarjeta (blanco por defecto). */
  backgroundColor?: string;
  /** Sin borde (p. ej. caja informativa verde). */
  borderless?: boolean;
}

/**
 * Tarjeta blanca de radio 20. El trazo `#EAEAEA` de 1 pt es EXTERIOR al relleno (el relleno mide
 * exactamente 330×74 y el borde lo rodea), tal como lo exporta Figma: se dibuja como capa aparte
 * para no alterar las medidas del layout.
 */
export function Card({
  children,
  style,
  radius = radii.card,
  backgroundColor = colors.card,
  borderless = false,
}: CardProps) {
  return (
    <View style={[{ backgroundColor, borderRadius: radius }, style]}>
      {children}
      {borderless ? null : (
        <View pointerEvents="none" style={[styles.border, { borderRadius: radius + 1 }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  border: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
