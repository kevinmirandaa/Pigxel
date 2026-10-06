import { Platform, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import type { Emoji } from '@/data';

import { layout } from '../tokens';

export interface EmojiBadgeProps {
  emoji: Emoji;
  /** Alto/ancho del contenedor en puntos (35 en listas, 50 en menús). */
  size?: number;
  /** Fondo del contenedor (p. ej. `colors.bg` para el círculo de 50 en Agregar). Sin fondo por defecto. */
  background?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Emoji de usuario dibujado por el sistema (Apple Color Emoji en iOS, Noto Color Emoji en Android).
 * Sin `fontFamily` a propósito: dejar que el sistema elija la fuente de emoji.
 */
export function EmojiBadge({ emoji, size = layout.emojiSize, background, style }: EmojiBadgeProps) {
  // El glifo ocupa ~80 % del contenedor; lineHeight evita que Android recorte la parte superior.
  const fontSize = Math.round(size * 0.8);
  const lineHeight = Math.round(fontSize * (Platform.OS === 'android' ? 1.25 : 1.2));

  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.box,
        { width: size, height: size, borderRadius: size / 2 },
        background ? { backgroundColor: background } : null,
        style,
      ]}
    >
      <Text
        allowFontScaling={false}
        style={{ fontSize, lineHeight, textAlign: 'center', includeFontPadding: false }}
      >
        {emoji}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
});
