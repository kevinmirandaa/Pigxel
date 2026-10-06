import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import { Pressable } from '../primitives/Pressable';
import { colors, layout } from '../tokens';

export interface ToggleProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel: string;
}

const { width: W, height: H, knob: K, knobInset: I } = layout.toggle;

/**
 * Interruptor estilo iOS 50×30 (perilla 26): encendido `#34C759`, apagado `#E9E9EB`.
 * Propio (no el Switch nativo) para que mida lo mismo en iOS y Android; el toque da háptica ligera.
 */
export function Toggle({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel,
}: ToggleProps) {
  const [progress] = useState(() => new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [progress, value]);

  const background = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.toggleOff, colors.toggleOn],
  });
  const x = progress.interpolate({ inputRange: [0, 1], outputRange: [I, W - K - I] });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      hitSlop={7}
      onPress={() => onValueChange?.(!value)}
    >
      <Animated.View
        style={[styles.track, { backgroundColor: background, opacity: disabled ? 0.5 : 1 }]}
      >
        <Animated.View style={[styles.knob, { transform: [{ translateX: x }] }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { width: W, height: H, borderRadius: H / 2, justifyContent: 'center' },
  knob: {
    width: K,
    height: K,
    borderRadius: K / 2,
    backgroundColor: colors.toggleKnob,
    boxShadow: '0 2 3 rgba(0,0,0,0.15)',
  },
});
