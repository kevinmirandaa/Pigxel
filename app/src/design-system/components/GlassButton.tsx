import { StyleSheet, View } from 'react-native';

import { iconSize, iconStroke, type LucideName } from '../icons';
import { Icon } from '../primitives/Icon';
import { Pressable, type PressableProps } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { layout } from '../tokens';
import { GlassSurface } from './GlassSurface';

interface BaseProps extends Omit<PressableProps, 'children' | 'style'> {
  accessibilityLabel: string;
}

export interface GlassIconButtonProps extends BaseProps {
  /** Ícono centrado (atrás, campana, +, filtro). */
  icon: LucideName;
  /** Diámetro (50 en el Figma). */
  size?: number;
  /** Punto de aviso (filtro activo, notificaciones nuevas). */
  badge?: boolean;
}

export interface GlassTextButtonProps extends BaseProps {
  /** Texto de la píldora (Ingreso / Gasto / Consulta). */
  label: string;
  /** Ancho opcional; por defecto se ajusta al texto (107 / 93 / 120 en el Figma). */
  width?: number;
  /** Ocupa su parte del ancho de una fila (varias píldoras repartiéndose el ancho disponible). */
  fill?: boolean;
}

export type GlassButtonProps = GlassIconButtonProps | GlassTextButtonProps;

const isText = (p: GlassButtonProps): p is GlassTextButtonProps => 'label' in p;

/**
 * Botón de Liquid Glass.
 *  · símbolo (50×50, círculo): `<GlassButton icon="ui/chevron-back" … />`
 *  · texto (alto 50, píldora): `<GlassButton label="Ingreso" … />`
 * iOS 26+: vidrio nativo. Resto: respaldo medido del Figma (ver GlassSurface).
 */
export function GlassButton(props: GlassButtonProps) {
  if (isText(props)) {
    const { label, width, fill, accessibilityLabel, ...rest } = props;
    return (
      <Pressable
        accessibilityLabel={accessibilityLabel ?? label}
        style={fill ? styles.fill : undefined}
        {...rest}
      >
        <GlassSurface
          radius={layout.glassPillHeight / 2}
          interactive
          style={[styles.pill, width ? { width } : null, fill ? styles.pillFill : null]}
        >
          <Text variant="bodyStrong" style={styles.pillText} allowFontScaling={false}>
            {label}
          </Text>
        </GlassSurface>
      </Pressable>
    );
  }
  const { icon, size = layout.glassButtonSize, badge = false, accessibilityLabel, ...rest } = props;
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      hitSlop={Math.max(0, (44 - size) / 2)}
      {...rest}
    >
      <GlassSurface
        radius={size / 2}
        interactive
        style={[styles.center, { width: size, height: size }]}
      >
        <Icon name={icon} size={iconSize.glass} color="#000000" strokeWidth={iconStroke.firm} />
        {badge ? <View style={styles.badge} /> : null}
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  pillFill: { paddingHorizontal: 8 },
  badge: {
    position: 'absolute',
    top: 11,
    right: 11,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  pill: {
    height: layout.glassPillHeight,
    paddingHorizontal: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: { includeFontPadding: false },
});
