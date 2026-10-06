import * as Haptics from 'expo-haptics';
import { Pressable as RNPressable, type PressableProps as RNPressableProps } from 'react-native';

export interface PressableProps extends RNPressableProps {
  /** Vibración ligera al presionar (iOS). */
  haptic?: boolean;
}

export function Pressable({ haptic = true, onPress, style, ...rest }: PressableProps) {
  return (
    <RNPressable
      accessibilityRole="button"
      {...rest}
      onPress={(event) => {
        if (haptic) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(event);
      }}
      style={(state) => [
        typeof style === 'function' ? style(state) : style,
        state.pressed && { opacity: 0.7 },
      ]}
    />
  );
}
