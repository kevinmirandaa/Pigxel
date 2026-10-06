import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, layout } from '../tokens';

export interface ProgressBarProps {
  /** Avance 0–100. */
  percent: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

/** Barra de avance de objetivos: pista `#E9E9EB` de 6 pt de alto y avance azul `#007FFF`, extremos redondos. */
export function ProgressBar({
  percent,
  style,
  accessibilityLabel = 'Avance del objetivo',
}: ProgressBarProps) {
  const value = Math.min(100, Math.max(0, percent));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value) }}
      style={[styles.track, style]}
    >
      <View style={[styles.fill, { width: `${value}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: layout.progress.height,
    borderRadius: layout.progress.height / 2,
    backgroundColor: colors.progressTrack,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: layout.progress.height / 2, backgroundColor: colors.blue },
});
