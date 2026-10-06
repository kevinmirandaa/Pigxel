import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { colors, layout } from '../tokens';

export interface TabsUnderlineItem<T extends string> {
  value: T;
  label: string;
}

export interface TabsUnderlineProps<T extends string> {
  items: readonly TabsUnderlineItem<T>[];
  value: T;
  onChange: (value: T) => void;
}

const LABEL_W = layout.tabsUnderline.labelWidth;
const T = layout.tabsUnderline.thickness;
const LINE = layout.tabsUnderline.width;

/**
 * "Cuentas | Objetivos": etiquetas 18 Bold de 115 pt (activa negra, inactiva gris `#8F8F8F`) y subrayado
 * negro de 50 pt centrado bajo la activa, que se desliza. Centradas en la pantalla (86 → 316 en el Figma).
 */
export function TabsUnderline<T extends string>({ items, value, onChange }: TabsUnderlineProps<T>) {
  const activeIndex = Math.max(
    0,
    items.findIndex((i) => i.value === value),
  );
  const [x] = useState(() => new Animated.Value(activeIndex * LABEL_W + (LABEL_W - LINE) / 2));

  useEffect(() => {
    Animated.timing(x, {
      toValue: activeIndex * LABEL_W + (LABEL_W - LINE) / 2,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [activeIndex, x]);

  return (
    <View accessibilityRole="tablist" style={styles.wrap}>
      <View style={styles.row}>
        {items.map((item) => {
          const selected = item.value === value;
          return (
            <Pressable
              key={item.value}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              haptic={!selected}
              onPress={() => onChange(item.value)}
              style={styles.item}
            >
              <Text variant="bodyStrong" tone={selected ? 'primary' : 'secondary'}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Animated.View style={[styles.line, { transform: [{ translateX: x }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center', width: LABEL_W * 2 },
  row: { flexDirection: 'row' },
  item: { width: LABEL_W, height: 44, alignItems: 'center', justifyContent: 'center' },
  // Texto de 27 pt de alto en y=352; la línea cae en y=382 → 30 pt bajo la parte superior de la etiqueta.
  line: {
    position: 'absolute',
    top: 35,
    width: LINE,
    height: T,
    borderRadius: T / 2,
    backgroundColor: colors.black,
  },
});
