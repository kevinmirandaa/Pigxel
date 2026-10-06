import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { iconSize, iconStroke, type LucideName } from '../icons';
import { Icon } from '../primitives/Icon';
import { Pressable, type PressableProps } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { colors, layout, radii } from '../tokens';
import { GlassSurface } from './GlassSurface';

export interface PrimaryButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  /** `primary` negro (por defecto) · `glass` pastilla de vidrio con texto negro (Iniciar sesión en bienvenida). */
  variant?: 'primary' | 'glass';
  /** Flecha → a la derecha (en "Crear →"); solo `primary`. */
  withArrow?: boolean;
  /** Ícono a la izquierda del texto (variante `glass`, p. ej. "@" o mail). */
  leftIcon?: LucideName;
  loading?: boolean;
}

/**
 * Botón en píldora (alto 60, radio 30, ANCHO FLEXIBLE: ocupa el ancho del contenedor; en bienvenida el
 * contenedor tiene margen 51). Negro con texto blanco 20 Semibold centrado y flecha a 22 pt del borde
 * derecho. Estados: `loading` (spinner en lugar de la flecha) y `disabled` (opacidad 0,4).
 * Nota para el cliente: el Figma no define cargando/deshabilitado; se infirieron.
 */
export function PrimaryButton({
  label,
  variant = 'primary',
  withArrow = true,
  leftIcon,
  loading = false,
  disabled = false,
  onPress,
  accessibilityLabel,
  ...rest
}: PrimaryButtonProps) {
  const inactive = disabled || loading;
  const common = {
    accessibilityLabel: accessibilityLabel ?? label,
    accessibilityState: { disabled: inactive, busy: loading },
    disabled: inactive,
    onPress,
    style: styles.stretch,
    ...rest,
  };

  if (variant === 'glass') {
    return (
      <Pressable {...common}>
        <GlassSurface
          radius={radii.pill}
          interactive
          style={[styles.glass, inactive && styles.dim]}
        >
          {leftIcon ? (
            <Icon name={leftIcon} size={22} color={colors.black} strokeWidth={iconStroke.default} />
          ) : null}
          <Text variant="button" style={styles.glassText} numberOfLines={1}>
            {label}
          </Text>
        </GlassSurface>
      </Pressable>
    );
  }

  return (
    <Pressable {...common}>
      <View style={[styles.button, inactive && styles.dim]}>
        <Text variant="button" tone="inverse" numberOfLines={1} style={styles.label}>
          {label}
        </Text>
        <View style={styles.arrow}>
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : withArrow ? (
            <Icon
              name="arrow-right"
              size={iconSize.arrow}
              color={colors.white}
              strokeWidth={iconStroke.firm}
            />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stretch: { alignSelf: 'stretch' },
  button: {
    height: layout.primaryButton.height,
    borderRadius: layout.primaryButton.height / 2,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Texto centrado con holgura a ambos lados para que nunca pise la flecha (22 + 18 + 22).
  label: { paddingHorizontal: 62 },
  arrow: { position: 'absolute', right: 22, height: '100%', justifyContent: 'center' },
  glass: {
    height: layout.primaryButton.height,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  glassText: { includeFontPadding: false },
  dim: { opacity: 0.4 },
});
