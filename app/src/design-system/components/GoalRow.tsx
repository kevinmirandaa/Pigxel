import { StyleSheet, View } from 'react-native';

import type { Emoji } from '@/data';

import { EmojiBadge } from '../primitives/EmojiBadge';
import { Text } from '../primitives/Text';
import { colors, layout } from '../tokens';
import { Card } from './Card';

export interface GoalRowProps {
  name: string;
  emoji: Emoji;
  /** Ahorro actual (negro), ya formateado. */
  saved: string;
  /** Monto meta (azul `#007FFF`), ya formateado. */
  target: string;
}

/**
 * Tarjeta de objetivo (pestaña Cuentas · Objetivos): emoji, nombre y "Objetivo:" debajo; a la derecha el ahorro
 * actual en negro y la meta en azul, alineados con esas dos líneas. No es pulsable (el Figma no tiene detalle).
 */
export function GoalRow({ name, emoji, saved, target }: GoalRowProps) {
  return (
    <Card style={styles.row}>
      <EmojiBadge emoji={emoji} size={layout.emojiSize} />
      <View style={styles.left}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {name}
        </Text>
        <Text variant="caption" tone="secondary">
          Objetivo:
        </Text>
      </View>
      <View style={styles.right}>
        <Text variant="bodyStrong" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {saved}
        </Text>
        <Text
          variant="bodyStrong"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
          style={{ color: colors.blue }}
        >
          {target}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    alignSelf: 'stretch',
    height: layout.card.height,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 16,
    gap: 14,
  },
  left: { flex: 1, minWidth: 0 },
  right: { alignItems: 'flex-end', maxWidth: '45%', flexShrink: 0 },
});
