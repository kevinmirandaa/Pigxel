import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { colors, layout } from '../tokens';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Ocupa todo el ancho del contenedor (por defecto se estira hasta 252,5 pt, su ancho en el Figma). */
  fullWidth?: boolean;
  accessibilityLabel?: string;
}

const { height: H, padding: P, activeExtra: X, activeHeight: AH, maxWidth: MAX } = layout.segmented;

/**
 * Control segmentado de 2–3 opciones (Gastos/Ingresos/Ambos, Activo/Inactivo, Semanal/Mensual/Anual).
 * Ancho FLEXIBLE: se estira al contenedor hasta un máximo de 252,5 pt; las opciones se reparten el ancho
 * medido (`onLayout`). Contenedor `#F0F0F0` con borde exterior `#EAEAEA`; la activa es una cápsula BLANCA
 * de 44 pt que se desliza; etiquetas 13 Semibold (activa negra, inactivas `#8F8F8F`).
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  fullWidth = false,
  accessibilityLabel,
}: SegmentedProps<T>) {
  const n = options.length;
  const [width, setWidth] = useState<number>(MAX);
  const optionW = (width - P * 2) / n;
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const [left] = useState(() => new Animated.Value(P + activeIndex * optionW));

  useEffect(() => {
    Animated.timing(left, {
      toValue: P + activeIndex * optionW,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [activeIndex, left, optionW]);

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      style={[styles.wrap, fullWidth ? null : { maxWidth: MAX }]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <View style={styles.container}>
        <View style={styles.border} pointerEvents="none" />
        <Animated.View style={[styles.active, { width: optionW + X, left }]} />
        {options.map((option, i) => {
          const selected = i === activeIndex;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={option.label}
              haptic={!selected}
              onPress={() => onChange(option.value)}
              style={[styles.option, { left: P + i * optionW, width: optionW }]}
            >
              <Text variant="label" tone={selected ? 'primary' : 'secondary'} numberOfLines={1}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch' },
  container: { height: H, borderRadius: H / 2, backgroundColor: colors.segment },
  border: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: H / 2 + 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  active: {
    position: 'absolute',
    top: (H - AH) / 2,
    height: AH,
    borderRadius: AH / 2,
    backgroundColor: colors.segmentActive,
    borderWidth: 1,
    borderColor: colors.border,
  },
  option: {
    position: 'absolute',
    top: 0,
    height: H,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
});
